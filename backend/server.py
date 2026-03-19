from flask import Flask, render_template, request, session, jsonify, send_from_directory
from flask_cors import CORS
from random import randint
from csv import writer, QUOTE_MINIMAL, reader
from os import getcwd, path, makedirs, listdir, rename, remove
import mysql.connector as db
from smtplib import SMTP
from email.message import EmailMessage
from string import Template
from pathlib import Path
from config import *
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from shutil import rmtree
from datetime import timedelta
from subprocess import run, PIPE
from threading import Thread


print('current dir:', getcwd())

mydb = db.connect(
    host = mysql_host,
    user = mysql_user,
    password = mysql_password,
    database = database_name,
)
cursor = mydb.cursor()

app = Flask(__name__)
CORS(app, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

print(__name__)

# Generate a secure and random secret key
app.secret_key = secret_key
app.config['SECRET_KEY'] = secret_key
app.config['JWT_SECRET_KEY'] = secret_key

# Set JWT expiration time to 5 minutes
app.config['JWT_EXPIRATION_DELTA'] = timedelta(minutes=20)
                                          
jwt = JWTManager(app)

# Home Page
@app.route('/')
def my_home():
    return render_template('index.html')


'''-----------------------------------------------------------------------------------------------------'''

# making it dynamic.
@app.route('/<string:page_name>')
def html_page(page_name):
    return render_template(page_name)


'''-----------------------------------------------------------------------------------------------------'''

# Disabling Favicon Request (chatgpt)
@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')


'''-----------------------------------------------------------------------------------------------------'''

#Default Error Handeling Technique.
# if                    {Checking for Post}
#     try               {Python Error Handeling}
#         if            {Yes return to Fronted}
#         else          {no return to Frontend}
#     except            {Catching Errors}
# else                  {Only When Post Broken}

'''-----------------------------------------------------------------------------------------------------'''

# (EMAIL CREATION) -> "OTP verification, Confimation of Contact Purpose, Confirmation for Subscibing to Newletter".
def send_email(team, subject, receiver, email_template, email_values):
    try:
        html = Template(Path(f'{email_template}.html').read_text())
        email = EmailMessage()

        email['from'] = team  # name.
        email['to'] = receiver  # To = Receiver.
        email['subject'] = subject  # Subject of Email.
        print(email_values)

        # The message is in html format with tags.
        # Using **args is same as using (name = 'xyz', otp = '000000').
        email.set_content(html.substitute(**email_values), 'html')

        # print(email)

        # Sending the Email.
        with SMTP(host='smtp.gmail.com', port=587) as smtp:
            smtp.ehlo()  # starting the server.

            smtp.starttls()  # Encryption mechanism.
            # login in using 'email-id' and 'app-password'.
            smtp.login(my_email, email_app_password)

            smtp.send_message(email)
            print('\nAll good Boss !')

    except Exception as e:
        print(f"Error while Sending the Email: {str(e)}")
        return jsonify({'error': 'An Error occurred on the server, while trying to Send the Email.'})


'''-----------------------------------------------------------------------------------------------------'''

# (WRITING INTO CSV) -> "email.csv, contact.csv" file.
def write_to_csv(file_path, data):
    try:
        with open(file_path, mode='a', newline='') as database:
            csv_writer = writer(database, delimiter=',', quotechar='"', quoting=QUOTE_MINIMAL)
            csv_writer.writerow(data)

    except Exception as e:
        print(f"Error while saving to database: {str(e)}")
        return jsonify({'error': 'An Error occurred on the server, while trying to Handle Your Query.'})


'''-----------------------------------------------------------------------------------------------------'''

# (READING FROM CSV) -> "timeline.csv, login_timestamp.csv" file.
def read_from_csv(file_path):
    try:
        with open(file_path, mode='r', newline='') as file:
            print('hi')
            csv_reader = reader(file)
            next(csv_reader, None)  # Skipping the header row if present
            data = [row for row in csv_reader if row]
        return data

    except Exception as e:
        print(f"Error while reading from CSV: {str(e)}")
        return None


'''-----------------------------------------------------------------------------------------------------'''

# OTP "generate, send ,resend & verify".

# Generating the Random 6 digit Otp.
def gen_otp():
    return randint(100000, 999999)


# Sending the OTP for 1st time or for resend.
def send_otp():
    session['user_otp_num'] = gen_otp()
    print(session.get('user_otp_num'), '\n')
    send_email('Face_Rec_Dec Team', 'Your Email Verification OTP (One-Time-Password).', session.get('user_login_id'), './emails/email_otp', {'name': session.get('user_name'), 'otp': session.get('user_otp_num')})


# Route for resending OTP.
@app.route('/resend', methods=['POST', 'GET'])
def resend():
    try:
        send_otp()
        return jsonify({'access': 'Granted'})
    
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error occurred during OTP Resending.'})


# OTP verification.
@app.route('/verify_otp', methods=['POST', 'GET'])
def verify_otp():
    if request.method == 'POST':
        try:
            print(type(session.get('user_otp_num')))  # We get the Values in str and not in Int, thats why it was malfunctioning.
            OTP = int(request.form.get('otp'))
            print(type(OTP))
            if OTP == session.get('user_otp_num'):
                return jsonify({'access': 'Granted', 'name': session.get('user_name'), 'message': f"{session.get('user_name')} OTP verification successful."})

            return jsonify({'access': 'Denied', 'message': 'The Entered OTP is Wrong, Please try again.'})

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'Error occurred during OTP verification.'})

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'})


'''-----------------------------------------------------------------------------------------------------'''

# Checking the Password from the database (REGISTER).
@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        try:
            user_name = request.form.get('name')
            user_login_id = request.form.get('login_id')
            user_password = request.form.get('password')

            # session.clear() #To clear all values from the Session. {Here Manually}
            session.pop('user_name', None)
            session.pop('user_login_id', None)
            session.pop('user_password', None)

            # print(name,login_id,password)

            # Check if the user already exists.
            query = "SELECT * FROM user_login WHERE login_id = %s"
            cursor.execute(query, (user_login_id,))

            data = cursor.fetchone()

            if data:    # User already exists
                return jsonify({'access': 'Denied', 'message': 'User already exists. Please Use a different Email.'}), 200

            session['user_name'] = user_name
            session['user_login_id'] = user_login_id
            session['user_password'] = user_password
            print(session)

            send_otp()  #Generate, Send the Otp to Email.

            return jsonify({'access': 'Granted', 'email': session.get('user_login_id')}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while creating Account.'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Checking the Password from the database.
@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        try:
            admin_login_id = request.form.get('login_id')
            admin_password = request.form.get('password')

            # Use parameterized query to prevent SQL injection
            query = "SELECT * FROM admin_login WHERE login_id = %s AND password = %s"
            cursor.execute(query, (admin_login_id, admin_password))

            data = cursor.fetchone()
            print(data)
            if data:    # Successful login
                access_token = create_access_token(identity=admin_login_id)
                print(access_token)
                return jsonify({'access': 'Granted', 'access_token': access_token}), 200

            # Invalid login credentials
            return jsonify({'access': 'Denied', 'message': 'Invalid login credentials.'}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while performing Logging.'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Route to check token validity.
@app.route('/check_token_validity', methods=['POST', 'GET'])
@jwt_required()
def check_token_validity():
    current_user = get_jwt_identity()
    return jsonify({'isTokenValid': True}), 200     #If it reaches here then Login is Valid.


'''-----------------------------------------------------------------------------------------------------'''

# Logging Out the Users.
@app.route('/logout', methods=['POST', 'GET'])
@jwt_required()  # Require a valid JWT token for logout
def logout():
    try:
        current_user = get_jwt_identity()
        print(f'Logging out user: {current_user}')
        return jsonify({'access': 'Granted'}), 200   # You can add additional logic here, such as logging or token revocation if needed.

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An Error occurred on the server, while performing LogOut.'}), 500


'''-----------------------------------------------------------------------------------------------------'''

# writing into the information of the "contact page" into 'database.csv' file.
def contact_csv(data):
    file_path = './csv/contact.csv'
    write_to_csv(file_path, [data['fname'], data['lname'], data['email'], data['message']])


# To send the email to the user's Gmail for "Confimation of Contact Purpose".
def email_contact(data):
    team = 'Face_Rec_Dec Support-Team'
    subject = 'Support Confirmation for the Query.'
    template_name = './emails/email_contact'
    email_values = {'name': data['fname'] + ' ' + data['lname']}

    send_email(team, subject, data['email'], template_name, email_values)


# Accepting the Contact Form, inserting data to 'contact.csv' and Sending a Email to User.
@app.route('/contact', methods=['POST', 'GET'])
def contact():
    if request.method == 'POST':
        try:
            data = request.form.to_dict()
            if data:
                print(f"Received data: {data}")

                email_contact(data)
                contact_csv(data)

                return jsonify({'access': 'Granted', 'message' : f"Thank You {data['fname'] + ' ' + data['lname']} for Contacting Us, We will reach out to you Soon."}), 200
            
            return jsonify({'access': 'Denied', 'message' : 'Please Enter Complete Details.'}), 200  # Near Impossible to Trigger.

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while submitting Information.'}), 500
    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# writing into the 'emails' of the "subscribed to newsletter" into 'database.csv' file.
def subscribe_csv(user_email_id):
    file_path = './csv/newsletter.csv'
    write_to_csv(file_path, [user_email_id])


# To send the email to the user's Gmail for "Confirmation for Subscibing to Newletter Purpose".
def email_subscribe(user_email_id):
    team = 'Face_Rec_Dec News-Team'
    subject = 'Thanking for Subscribing to News-Letter.'
    template_name = './emails/email_subscribe'
    email_values = {}

    send_email(team, subject, user_email_id, template_name, email_values)


# Subscribing the User to 'News-Letter', inserting data to 'newsletter.csv' and Sending Email to User.
@app.route('/subscribe', methods=['POST', 'GET'])
def subscribe():
    if request.method == 'POST':
        try:
            user_email_id = request.form.get('email')
            print(f"Received data: {user_email_id}")

            # Check if the user email alreay exists.
            query = "SELECT * FROM newsletter WHERE email = %s"
            cursor.execute(query, (user_email_id,))

            data = cursor.fetchone()

            if data:    # User already exists
                return jsonify({'access': 'Denied', 'message': 'User already subscribed to News-Letter.'}), 200

            subscribe_csv(user_email_id)
            email_subscribe(user_email_id)

            try:
                query = "INSERT INTO newsletter (email) VALUES (%s)"
                cursor.execute(query, (user_email_id,))
                mydb.commit()
                return jsonify({'access': 'Granted', 'message' : 'Thank You For Subscribing to Our News-Letter.'}), 200

            except Exception as e:       
                mydb.rollback()
                print(str(e))
                return jsonify({'error': 'An Error occurred on the server, while Subscribing to News-Letter.'}), 500

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while Subscribing to News-Letter.'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# To send the email to the user's Gmail for "Forgot Password Purpose".
def email_forgot(admin_email_id, data):
    team = 'Face_Rec_Dec Support-Team'
    subject = 'Forgotten Password'
    template_name = './emails/email_forgot'
    email_values = {'name': data[0], 'password': data[1]}

    send_email(team, subject, admin_email_id, template_name, email_values)


# Sending the Admin's Password to the Email, If the Admin Forgets his Password.
@app.route('/forgot', methods=['POST', 'GET'])
def forgot():
    if request.method == 'POST':
        try:
            admin_email_id = request.form.get('email')
            print(f"Received data: {admin_email_id}")

            # Check if the user exists or not.
            query = "SELECT name, password FROM admin_login WHERE login_id = %s"
            cursor.execute(query, (admin_email_id,))

            data = cursor.fetchone()
            print(data)

            if data:    #if user Exists.
                email_forgot(admin_email_id, data)
                return jsonify({'access': 'Granted', 'message' : f'Your Password has been Sent to {admin_email_id}'}), 200

            return jsonify({'access': 'Denied', 'message': 'Invalid Credentials.'}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while Trying to help you.'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Searching the user_name & user_id and Giving it to Frontend for Use.
@app.route('/search', methods=['POST', 'GET'])
def serach():
    if request.method == 'POST':
        try:
            search_item = request.form.get('search_item')
            filter = request.form.get('filter')

            # Use parameterized query to prevent SQL injection and handle different filters.
            if filter == 'user_id':
                query = "SELECT * FROM user_info WHERE user_id LIKE %s"
            else:
                query = "SELECT * FROM user_info WHERE user_name LIKE %s"

            # Add '%' only at the end to perform a prefix match in the LIKE clause.
            search_pattern = f"{search_item}%"

            cursor.execute(query, (search_pattern,))

            data = cursor.fetchall()

            if data:
                result_list = [{'user_id': row[1], 'user_name': row[2]} for row in data]
                print(result_list)
                return jsonify({'access' : 'Granted', 'message' : result_list}), 200

            return jsonify({'access': 'Denied', 'message': 'No matching records found.'}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while Searching For Users.'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Gets the Next Folder Id which also Acts as the "User_Id".
def next_user_folder():
    user_folders = [folder for folder in listdir(upload_folder) if folder.startswith('user')]
    if user_folders:
        return f'user{int(max(user_folders, key=lambda x: int(x[4:]))[4:]) + 1:04d}'
    return 'user0001'


# Uploads the Images into Folders. and also Records the user's Infromation in 'user_login' and 'user_info' tables.
@app.route('/upload', methods=['POST', 'GET'])
def upload_images():
    if request.method == 'POST':
        try:
            if 'images' not in request.files:
                return jsonify({'error': 'No file part'}), 400

            images = request.files.getlist('images')

            if len(images) != 4:
                return jsonify({'error': 'Please select exactly 4 images.'}), 400

            print("Images received")
            user_id = next_user_folder()    #The next Available Folder.
            folder_path = path.join(upload_folder, user_id)

            makedirs(folder_path, exist_ok=True)
            for image in images:
                file_storage = image
                if file_storage:
                    file_path = Path(folder_path, file_storage.filename)
                    print(file_path)
                    file_storage.save(file_path)

            try:
                # {user_id, user_name} into the 'User_info' Table.
                query = "INSERT INTO user_info (user_id, user_name) VALUES (%s, %s)"
                cursor.execute(query, (user_id ,session.get('user_name')))

                # {login_id, user_id, name, password} into the 'user_login' table.
                query = "INSERT INTO user_login (login_id, user_id, name, password) VALUES (%s, %s, %s, %s)"
                cursor.execute(query, (session.get('user_login_id'), user_id ,session.get('user_name'), session.get('user_password')))

                mydb.commit()   # Commit the transaction if everything is successful

            except Exception as e:
                mydb.rollback()
                print(e)
                return jsonify({'error': 'Failed to save to Database.', 'message': 'An error occurred on the server.', 'errortype': f'{str(e)}'}), 500

            return jsonify({'access': 'Granted', 'message': 'Files uploaded successfully.', 'message2': f"Account Creation Successful For {session.get('user_name')} : {user_id}"}), 200

        except Exception as e:
            print(e)
            return jsonify({'error': 'Failed to save files.', 'message': 'An error occurred on the server.', 'errortype': f'{str(e)}'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Uploads the Images of the User, which the User Deleted from the 'user0000' folder.
@app.route('/upload_edit', methods=['POST', 'GET'])
def upload_images_edit():
    if request.method == 'POST':
        if 'images' not in request.files or 'user_id' not in request.form or 'user_name' not in request.form:
            return jsonify({'error': 'No file part or userid/username.'}), 400

        user_id = request.form.get('user_id')
        user_name = request.form.get('user_name')
        images = request.files.getlist('images')

        print(user_name)
        print(images)

        print("Images received")
        user_folder_name = user_id
        folder_path = path.join(upload_folder, user_folder_name)

        try:
            # Generate the expected filenames
            expected_filenames = [f"{user_name}{i + 1}.jpg" for i in range(4)]

            # Create a set of existing filenames in the folder
            existing_filenames = set(file.name for file in Path(
                folder_path).iterdir() if file.is_file())

            # Identify missing files and upload them
            for expected_filename in expected_filenames:
                if expected_filename not in existing_filenames and images:
                    # Pop the first image from the list
                    file_storage = images.pop(0)
                    file_path = Path(folder_path, expected_filename)
                    file_storage.save(file_path)
                    print(f"Uploaded: {expected_filename}")

            return jsonify({'access': 'Granted', 'message': 'Files uploaded successfully', 'folderName': user_folder_name}), 200

        except Exception as e:
            print(e)
            return jsonify({'error': 'Failed to save files.', 'message': 'An error occurred on the server', 'errortype': f'{str(e)}'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Getting the List of the pictures which are needed to be sent.
@app.route('/match_face/<folder_name>', methods=['GET'])
def get_image_list(folder_name):
    try:
        folder_path = path.join(upload_folder, folder_name)
        if path.exists(folder_path) and path.isdir(folder_path):
            images = [image for image in listdir(folder_path) if path.isfile(
                path.join(folder_path, image))]
            print(images)
            return jsonify({'images': images}), 200
        
        return jsonify({'error': 'Folder not found'}), 404

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred on the server.'}), 500


# Sending the Pictures via URL to Frontend.
@app.route('/match_face/<folder_name>/<image_name>', methods=['GET'])
def get_image(folder_name, image_name):
    try:
        # Construct the path to the requested image
        image_path = path.join(upload_folder, folder_name, image_name)
        # Check if the image exists
        if path.exists(image_path):
            # Serve the image
            return send_from_directory(path.join(upload_folder, folder_name), image_name), 200

        # Return a 404 error if the image does not exist
        return jsonify({'error': 'Image not found'}), 404

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred on the server.'}), 500


'''-----------------------------------------------------------------------------------------------------'''

# Delete the Account Related Information of the User from 'user_info' and 'user_login' tables.
@app.route('/delete_account', methods=['POST', 'GET'])
def delete_account():
    if request.method == 'POST':
        try:
            user_user_id = request.form.get('user_id')
            print(user_user_id)
            print(type(user_user_id))

            images_folder = path.join(upload_folder, user_user_id)

            # Check if the folder exists before proceeding
            if path.exists(images_folder) and path.isdir(images_folder):
                rmtree(images_folder)
                print(f"Deleted: Folder for user with ID {user_user_id}")
            
                try:
                    # Delete All records of the User from the 'user_info' table.
                    query = "DELETE FROM user_info WHERE user_id = %s"
                    cursor.execute(query, (user_user_id,))

                    # Delete All records of the User from the 'user_login' table.
                    query = "DELETE FROM user_login WHERE user_id = %s"
                    cursor.execute(query, (user_user_id,))
                    mydb.commit()  

                    return jsonify({'success': True, 'message': f'Deleted Account for user with ID: {user_user_id}'}), 200
                
                except Exception as e:       
                    mydb.rollback()
                    print(str(e))
                    return jsonify({'error': 'An Error occurred on the server, while Renaming The files.'}), 500

            # No matching records found
            return jsonify({'success': False, 'message': 'User Account does not exist.'}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An error occurred on the server.'}), 500
    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Delete the Perticular Image of the User's from the 'user0000' Folders.
@app.route('/delete_image', methods=['POST', 'GET'])
def delete_image():
    if request.method == 'POST':
        try:
            user_user_id = request.form.get('user_id')
            image_name = request.form.get('image_name')

            images_folder = path.join(upload_folder, user_user_id)

            # Check if the folder exists before proceeding
            if path.exists(images_folder) and path.isdir(images_folder):
                file_path = path.join(images_folder, image_name)                # Construct the file path for the specific image

                # Check if the file exists and then delete it
                if path.isfile(file_path):
                    remove(file_path)
                    print(f"Deleted: Image '{image_name}' for user with ID {user_user_id}")
                    return jsonify({'success': True, 'message': f'Deleted image "{image_name}" for user with ID: {user_user_id}'}), 200
                
                return jsonify({'success': False, 'message': f'Image "{image_name}" not found for user with ID: {user_user_id}'}), 200
            
            return jsonify({'success': False, 'message': 'User folder does not exist.'}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An error occurred on the server.'}), 500
    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# To Rename the Images stored in the User's Folder '{user0000}'.
@app.route('/rename', methods=['POST', 'GET'])
def rename_images():
    if request.method == 'POST':
        try:
            user_user_id = request.form.get('user_id')
            new_name = request.form.get('new_name')
            old_name = request.form.get('old_name')

            images_folder = path.join(upload_folder, user_user_id)

            # Check if the folder exists before proceeding
            if path.exists(images_folder) and path.isdir(images_folder):

                # Rename all files in the folder
                for index, filename in enumerate(listdir(images_folder)):
                    if path.isfile(path.join(images_folder, filename)):

                        # Construct the new path with the new name
                        new_filename = path.join(images_folder, f"{new_name}{index + 1}{path.splitext(filename)[1]}")
                        rename(path.join(images_folder, filename), new_filename)

                try:
                    # Update user_name in 'user_info' table
                    query = "UPDATE user_info SET user_name = %s WHERE user_id = %s"
                    cursor.execute(query, (new_name, user_user_id))

                    # Update name in 'user_login' table
                    query = "UPDATE user_login SET name = %s WHERE user_id = %s"
                    cursor.execute(query, (new_name, user_user_id))
                    mydb.commit()  # Commit the transaction if everything is successful

                    return jsonify({'success': True, 'message': f'Images renamed successfully to: {new_name}'}), 200
                
                except Exception as e:       
                    mydb.rollback()
                    print(str(e))
                    return jsonify({'error': 'An Error occurred on the server, while Renaming The files.'}), 500

            # User folder does not exist
            return jsonify({'success': False, 'error': 'User folder does not exist.'}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while Renaming The files.'}), 500
    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# To send the email to the user's Gmail for "Submission of Review".
def email_review(data):
    team = 'Face_Rec_Dec Team'
    subject = 'Thank You For Reviewing Us.'
    template_name = './emails/email_review'
    email_values = {'name': data['name']}

    send_email(team, subject, data['email'], template_name, email_values)


# writing into the information of the "Reviews page" into 'reviews.csv' file.
def review_csv(data):
    file_path = './csv/reviews.csv'
    write_to_csv(file_path, [data['name'], data['email'], data['rating'], data['review']])


# Submitting the 'Reviews' by saving to Reviews.csv and Reviews table in database.
@app.route('/submit_reviews', methods=['POST', 'GET'])
def submit_review():
    if request.method == 'POST':
        try:
            name = request.form.get('name')
            email = request.form.get('email')
            rating = request.form.get('rating')
            review = request.form.get('review')

            # Check if all required fields are present
            if not name or not email or not review or not rating:
                return jsonify({'error': 'Incomplete data submitted.'}), 400

            data = request.form.to_dict()
            print(f"Received data: {data}")

            # Check if the user already exists.
            query = "SELECT * FROM reviews WHERE email = %s"
            cursor.execute(query, (email,))
            existing_user = cursor.fetchone()

            if existing_user:                   # User already exists
                return jsonify({'access': 'Denied', 'message': 'User has already provided a review.'}), 200

            # Insert into MySQL database
            query = "INSERT INTO reviews (name, email, review, rating) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (name, email, review, rating))
            mydb.commit()

            email_review(data)
            review_csv(data)

            return jsonify({'access': 'Granted', 'message': 'Review submitted successfully.'}), 200

        except Exception as e:
            mydb.rollback()
            print(str(e))
            return jsonify({'error': 'An error occurred on the server, while Storing Reviews.'}), 500
    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Sending the 'Reviews' data from the Database back to the Frontend.
@app.route('/fetch_reviews', methods=['POST', 'GET'])
def fetch_reviews():
    try:
        # Fetch the latest 6 reviews data from the database.    
        query = "SELECT name, email, rating, review FROM reviews ORDER BY id DESC LIMIT 6"
        cursor.execute(query)
        data = cursor.fetchall()

        print(data)

        if data:    # Prepare the reviews data in JSON format using list comprehension
            reviews_list = [{'name': row[0], 'email': row[1], 'rating': row[2], 'review': row[3]} for row in data]
            print(reviews_list)

            return jsonify(reviews_list), 200

        return jsonify({'message': 'No Reviews were found.'}), 200

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred on the server, while fetching reviews.'}), 500


'''-----------------------------------------------------------------------------------------------------'''

# Sending the data of the 'timeline.csv' (General Timeline) to the Frontend.
@app.route('/fetch_timeline', methods=['POST', 'GET'])
def fetch_timeline():
    try:
        data = read_from_csv('./csv/timeline.csv')      #Reading data from 'timeline.csv' file.
        print(data)

        if data:
            result_list = [{'name': row[0], 'date': row[1], 'time': row[2]} for row in data]
            print(result_list)

            return jsonify({'access' : 'Granted', 'message' : result_list}), 200

        return jsonify({'message': 'No Reviews were found.'}), 200

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred on the server, while fetching General Timeline.'}), 500


'''-----------------------------------------------------------------------------------------------------'''    

# Sending the data of the 'login_timeline.csv' (Login Timeline) to the Frontend.
@app.route('/fetch_login_timestamp', methods=['POST', 'GET'])
def fetch_login_timestamp():
    try:  
        data = read_from_csv('./csv/login_timestamp.csv')      #Reading data from 'login_timestamp.csv' file.  
        print(data)

        if data:
            result_list = [{'name': row[0], 'date': row[1], 'time': row[2]} for row in data]
            print(result_list)

            return jsonify({'access' : 'Granted', 'message' : result_list}), 200

        return jsonify({'message': 'No Reviews were found.'}), 200

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred on the server, while fetching Login Timestamps.'}), 500


'''-----------------------------------------------------------------------------------------------------'''

# writing into the information of the "General Timeline" into 'timeline.csv' file.
def timeline_csv(formatted_data):
    file_path = './csv/timeline.csv'
    for row in formatted_data:
        write_to_csv(file_path, [row['name'], row['date'], row['time']])


# writing into the information of the "Login Timestamp" into 'login_timestamp.csv' file.
def login_timestamp_csv(formatted_data):
    file_path = './csv/login_timestamp.csv'
    for row in formatted_data:
        write_to_csv(file_path, [row['name'], row['date'], row['time']])


# Function to run the speech script.
def run_voice(names):
    extracted_names = ',and '.join(entry['name'] for entry in names)

    custom_sentence = f'Welcome {extracted_names}'
    print(custom_sentence)

    try:
        run(['python.exe', './script/voice_script.py', custom_sentence], stdout=PIPE, text=True)
    except Exception as e:
        print(f"Error in run_voice: {e}")


# Starting the Model for Face Detection and Getting Output. Performing String Manipulation to get Desired Results.
@app.route('/start_model', methods=['POST','GET'])
def start_model():
    try:
        result = run(['python.exe', './script/face.py'], stdout=PIPE, text=True)
        output = result.stdout.strip()
        print('Output:', output)            

        data_list = [name.strip() for name in output.split("[")[1].split("]")[0].replace("'", "").split(",") if name.strip()]

        if not data_list:   
            return jsonify({'access' : 'Denied', 'message': 'No Face was Detected.'}), 200
        
        formatted_data = []
        for entry in data_list:         
            parts = entry.split('_')                                        
            formatted_entry = {
                'name': parts[0][:-1] if parts[0][-1].isdigit() else parts[0],  
                'date': parts[1].replace("-", "/"),                             
                'time': parts[2].replace("-", ":") + " " + parts[3]             
            }
            formatted_data.append(formatted_entry)

        print('formatted-data:', formatted_data)

        timeline_csv(formatted_data)

        if any(entry['name'] == 'Unknown' for entry in formatted_data):
            return jsonify({'access' : 'Denied', 'message': 'An Unknown face was Detected! Login Failed!'}), 200 

        login_timestamp_csv(formatted_data)

        names = [{"name": entry['name']} for entry in formatted_data]
        print('names:', names)

        try:
            Thread(target=run_voice, args=(names,)).start()
        except ValueError:
            pass

        if names:
            return jsonify({'access' : 'Granted', 'message' : names}), 200

        return jsonify({'access' : 'Denied', 'message': 'An Unknown face was Detected! Login Failed!'}), 200  
    
    except Exception as e:
        print(f"Error starting model: {e}")
        return jsonify({'error': 'An error occurred on the server, while Starting Face Recognition Model.'}), 500










