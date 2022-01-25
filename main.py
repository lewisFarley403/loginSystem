import sqlite3
from flask import Flask, make_response, request
import random
ACTIVE_USERS = {}  # global all users currently connected


class Client:
    def __init__(self):
        self.attrs = {}  # userID,pin,password
        self.con = sqlite3.connect('database.db')  # connects to the database
        self.cur = self.con.cursor()  # allows to be read

    def checkUserID(self, userid):
        res = list(self.cur.execute(
            f'SELECT * FROM users WHERE userid= \'{userid}\''))
        #print(f'SELECT * FROM users WHERE userid = \'{userid}\'')

        if len(res) == 0:
            return False
        print(res)
        res = res[0]
        self.attrs['userid'] = res[0]
        self.attrs['pin'] = res[1]
        self.attrs['password'] = res[2]
        return True

    def testDB(self):
        # for testing
        print([i for i in self.cur.execute('SELECT userid FROM users')])

    def getPasswordCharacters(self):
        password = self.attrs['password']
        options = [i for i in range(len(password))]
        for i in range(len(options)-3):
            options.pop(random.randint(0, len(options)-1))
        chars = [self.attrs['password'][i] for i in options]
        self.options = options
        self.chars = chars
        return{  # 'chars': chars,
            'indices': options,
            'error': 'False'}  # return the json

    def checkPin(self, pin):
        pin = int(pin)
        print(type(self.attrs['pin']), type(pin))
        if self.attrs['pin'] == pin:
            return True
        return False

    def checkChars(self, c1, c2, c3):
        print(c1, self.chars[0], c2, self.chars[1], c3, self.chars[2])
        if c1 == self.chars[0] and c2 == self.chars[1] and c3 == self.chars[2]:
            return True
        return False


app = Flask(__name__)


# this variable, db, will be used for all SQLAlchemy commands

s = Client()


@app.route('/clientToken')  # adds the api endpoints for the user to click on
def clientToken():
    r = str(random.randint(0, 10000000))
    ACTIVE_USERS[r] = []
    return {'data': r}


@app.route('/checkUserID')
def checkUserID():
    s = Client()
    data = request.args.get('userID')
    token = request.args.get('token')
    print(token)
    # print(data)
    res = s.checkUserID(data)
    if res == True:
        ACTIVE_USERS[token] = s
    # return {'data': str(res), 'token': token}
    return str(res)


@app.route('/checkpin')
def checkPin():
    token = request.args.get('token')
    pin = request.args.get('pin')
    print(list(ACTIVE_USERS.keys()))
    if token in ACTIVE_USERS:
        s = ACTIVE_USERS[token]
        res = s.checkPin(pin)
        return str(res)
    else:
        return str(False)


@app.route('/characters')
def getCharacters():
    token = request.args.get('token')
    print(token, ACTIVE_USERS)
    s = ACTIVE_USERS[token]
    print(s)
    return s.getPasswordCharacters()


@app.route('/checkDigits')
def checkDigits():
    c1 = request.args.get('char1')
    c2 = request.args.get('char2')
    c3 = request.args.get('char3')
    token = request.args.get('token')
    s = ACTIVE_USERS[token]
    res = s.checkChars(c1, c2, c3)
    return str(res)


if __name__ == '__main__':

    app.run(debug=True)
