from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.secret_key = "your_secret_key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        first_name = request.form.get('fname')
        last_name = request.form.get('lname')
        email = request.form.get('email')
        password = request.form.get('password')
        retype_password = request.form.get('retype_pwd')

        # Check if passwords match
        if password != retype_password:
            flash('Passwords do not match!', 'danger')
            return redirect(url_for('register'))

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            flash('A user with this email already exists!', 'danger')
            return redirect(url_for('register'))

        if User.query.filter_by(username=f"{first_name} {last_name}").first():
            flash('A user with this name already exists!', 'danger')
            return redirect(url_for('register'))

        # Hash password and save user
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(
            username=f"{first_name} {last_name}",
            email=email,
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()

        flash('You have successfully registered! Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Добро пожаловать, ' + user.username + '!', 'success')
            return redirect(url_for('profile'))
        else:
            flash('Неправильный email или пароль.', 'danger')
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        flash('Вы должны войти в систему, чтобы получить доступ к профилю.', 'danger')
        return redirect(url_for('login'))
    return render_template('profile.html', username=session['username'])

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    flash('Вы вышли из системы.', 'success')
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
