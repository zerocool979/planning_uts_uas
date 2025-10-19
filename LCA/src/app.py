import os
from flask import Flask, redirect, url_for
from flask_login import LoginManager, current_user
from werkzeug.security import generate_password_hash
from src.models import db, User
from src.routes import main_bp
from src.routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    
    # --- CONFIG ---
    from src.config import DevelopmentConfig
    app.config.from_object(DevelopmentConfig)


    # --- INIT EXTENSIONS ---
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Silakan login untuk mengakses halaman ini.'
    login_manager.login_message_category = 'warning'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # --- REGISTER BLUEPRINTS ---
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')

    # --- CREATE DB & ADMIN ---
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(role='admin').first():
            admin_user = User(
                email='admin@tazkia.ac.id',
                username='Administrator',
                password_hash=generate_password_hash('admin_password'),
                role='admin'
            )
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Admin default dibuat: admin@tazkia.ac.id / admin_password")

    # --- ROUTES ---
    @app.route('/')
    def index():
        if current_user.is_authenticated:
            return redirect(url_for('main.dashboard'))
        return redirect(url_for('auth.login'))

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
