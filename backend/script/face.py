# Facial Recognition and Detection Script, to Print the name of the person and Forward to Frontend.

import cv2
from time import time
from deepface import DeepFace
from threading import Thread, active_count, enumerate
from os import listdir, path
from datetime import datetime

#Face Capturing.
face_cap = cv2.CascadeClassifier("./script/models/haarcascade_frontalface_default.xml")

#Creating the Video Capturing Object.
video_cap = cv2.VideoCapture(0)

#FLAGS:-
last_run_time = 0           #track the "last run time".

face_match = False          #track the "face_match".

faces_detected = False      #Flag to check if faces were detected during run.

face_list = []              #Creates a list to store all the faces.

# Function to get the maximum face counter value from saved faces folder
def get_max_face_counter():
    #Directory path
    directory = "./saved faces/"

    files = listdir(directory)

    #Sort files based on modification time
    files.sort(key=lambda x: path.getmtime(path.join(directory, x)), reverse=True)

    current_hour = (datetime.now().hour % 12) or 12
    current_period = "AM" if datetime.now().hour < 12 else "PM"

    filename = files[0]

    if filename.startswith("face_") and filename.endswith(".jpg"):  #face_April-11-2024_12-22-19_PM_1.jpg
        counter_parts = filename.split("_")                         #['face', 'April-11-2024', '01-01-32', 'PM', '1.jpg']
        timestamp_parts = counter_parts[2].split("-")               #['01', '01', '32']
        hour_part = int(timestamp_parts[0])                         #[1]    #Extracting the hour part
        period = counter_parts[3]
        if hour_part == current_hour and period == current_period:
            counter = int(counter_parts[-1].split(".")[0]) + 1
        else:
            counter = 1
        
    return counter


face_counter = get_max_face_counter()   #track the "Face_number".


'''-----------------------------------------------------------------------------------------------------'''

#Defining the Functions:-

#Function to Match the Face of a Person with the Stored Images.
def check_face(cropped_face, timestamp):
    global face_match
    try:
        outer_break = False  # Flag to break the outer loop.    
        for folder in listdir("./match_face/"):
            for face in listdir(f"./match_face/{folder}"): 
                image = cv2.imread(f"./match_face/{folder}/{face}")
                
                if DeepFace.verify(cropped_face, image.copy(), model_name="Facenet512")['verified']:
                    face_match = True
                    face_match_name = face.removesuffix(".jpeg").removesuffix(".jpg")   #Better just keep the {face} from 'for' loop and                                                               
                    face_list.append(f"{face_match_name}_{timestamp}")                  #append the face name while removing the suffix.
                    outer_break = True  # Set the flag to break the outer loop.
                    break                                                               #for info look into './versions/gpt_for_face_list.py'.

                else:
                    face_match = False

            if outer_break:
                    break  # Break the outer loop if the flag is set.
            
        if not face_match: # If verification failed, append "unknown" to face_list along with the timestamp.
            face_list.append(f"Unknown_{timestamp}")

    except ValueError:
        face_match = False


# Function to generate a unique filename for saving the face.
def save_crop_image(cropped_face):
    global face_counter
    timestamp = datetime.now().strftime("%B-%d-%Y_%I-%M-%S_%p")
    face_filename = f'./saved faces/face_{timestamp}_{face_counter}.jpg'
    cv2.imwrite(face_filename, cropped_face)
    face_counter += 1
    return timestamp


'''-----------------------------------------------------------------------------------------------------'''

#Running the Camera All-Time.
while True:
    ret, video_data = video_cap.read()

    grey = cv2.cvtColor(video_data, cv2.COLOR_BGR2GRAY)

    faces = face_cap.detectMultiScale(grey, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

    current_time = time()

    # Calculate the remaining time until the next detection interval
    remaining_time = 10.0 - (current_time - last_run_time)

    # Display countdown on the screen
    cv2.putText(video_data, f"Next detection in: {remaining_time:.1f} sec", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

    if current_time - last_run_time >= 10.0:
        last_run_time = current_time

        for (x, y, w, h) in faces:
            cropped_face = video_data[y: y + h, x: x + w]

            cv2.rectangle(video_data, (x-1, y-1), (x + w, y + h), (0,255,0), 1)   #Drawing the rectangle (green) around the face.
            cv2.putText(video_data, "MATCHING !!", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 2)
            timestamp = save_crop_image(cropped_face)

            try:
                # Create and start the thread for face recognition.
                thread = Thread(target=check_face, args=(cropped_face.copy(), timestamp))
                thread.start()

            except ValueError:
                pass

        # Set the flag if faces were detected
        if len(faces) > 0:
            faces_detected = True

    else:
        for (x, y, w, h) in faces:
            cv2.rectangle(video_data, (x-1, y-1), (x + w, y + h), (0,255,0), 1)   #Drawing the rectangle (green) around the face.
            cv2.putText(video_data, "MATCHING !!", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Video_Live", video_data)

    # print(enumerate())

    #Check if the Current number of Threads.
    if active_count() == 1 and faces_detected:
        print("Detected Faces:", face_list)
        break

    #Press 'q' to exit the Program.
    if cv2.waitKey(1) == ord('q'):
        print("Detected Faces:", face_list)
        break

video_cap.release()
cv2.destroyAllWindows()
