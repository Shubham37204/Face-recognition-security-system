#A config file for the Backend keys and tokens and some private variables.

# print(__name__)       #it prints 'config' if we run from the 'main.py' file and '__main__' if ran directly.

if __name__ == 'config':    #to make sure it donot run 'directly' and 'only run' when it is being 'called'.

    from secrets import token_hex
    
    mysql_host = "Your MySQL Host Name"

    mysql_user = "Your MySQL User Name"

    mysql_password = "Your MySQL Password"

    database_name = "Name of Your Database"

    my_email = 'Your Email/Gmail ID'

    email_app_password = 'Your Email/Gmail App Password'

    upload_folder = './match_face/'

    secret_key = token_hex(16)