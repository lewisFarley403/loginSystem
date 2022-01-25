import sqlite3
con = sqlite3.connect('database.db')
cur = con.cursor()
#cur.execute('DROP TABLE users')
# cur.execute('''CREATE TABLE users
# (userid text, pin number, password text, failTime text)''')
# cur.execute("INSERT INTO users VALUES ('HayleyDavies','1234','password','')")

# cur.execute("INSERT INTO users VALUES ('lewisfarle','1234','password','')")
# cur.execute("INSERT INTO users VALUES ('testUser12','4321','password2','')")
con.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
con.close()
