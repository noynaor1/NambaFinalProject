from datetime import datetime
from backend import db, login_manager
from flask_login import UserMixin


class Subscribe(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), primary_key=True)

    def __repr__(self):
        return f"Subscribe(post id : '{self.post_id}', user id: '{self.user_id}')"


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(20))

    def __repr__(self):
        return f"Notification(post id: '{self.post_id}', user id: '{self.user_id}', mode: '{self.type}')"


class Follow(db.Model):
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"Follow('{self.timestamp}')"


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    first_name = db.Column(db.String(20))
    last_name = db.Column(db.String(20))
    gender = db.Column(db.String(20), nullable=False)
    birth_date = db.Column(db.Date())
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    posts = db.relationship('Posts', backref='posted', lazy='dynamic')
    followed = db.relationship('Follow', foreign_keys=[Follow.follower_id],
                               backref=db.backref('follower', lazy='joined'),
                               lazy='dynamic', cascade='all, delete-orphan')
    followers = db.relationship('Follow', foreign_keys=[Follow.followed_id],
                                backref=db.backref('followed', lazy='joined'),
                                lazy='dynamic', cascade='all, delete-orphan')
    subscribed_to = db.relationship('Subscribe', foreign_keys=[Subscribe.user_id],
                                 backref=db.backref('subscribed_to', lazy='joined'),
                                 lazy='dynamic', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', foreign_keys=[Notification.user_id],
                                    backref=db.backref('notification', lazy='joined'),
                                    lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"

    def follow(self, user):
        if not self.is_following(user):
            f = Follow(follower=self, followed=user)
            db.session.add(f)
            db.session.commit()

    def unfollow(self, user):
        f = self.followed.filter_by(followed_id=user.id).first()
        if f:
            db.session.delete(f)
            db.session.commit()

    def is_following(self, user):
        if user.id is None:
            return False

        return self.followed.filter_by(
            followed_id=user.id).first() is not None

    def is_followed_by(self, user):
        if user.id is None:
            return False

        return self.followers.filter_by(
            follower_id=user.id).first() is not None

    def subscribe(self, post):
        if not self.is_subscribed(post):
            f = Subscribe(subscribed_to=self, subscriber=post)
            db.session.add(f)
            db.session.commit()

    def is_subscribed(self, post):
        if post.id is None:
            return False

        return self.subscribed_to.filter_by(
            post_id=post.id).first() is not None


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    country = db.Column(db.Text, nullable=False)
    city = db.Column(db.Text, nullable=False)
    latitude = db.Column(db.Integer, nullable=False)
    longitude = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    subscribers = db.relationship('Subscribe',
                                  foreign_keys=[Subscribe.post_id],
                                  backref=db.backref('subscriber', lazy='joined'),
                                  lazy='dynamic',
                                  cascade='all, delete-orphan')

    def __repr__(self):
        return f"Posts('{self.date_posted}')"

    def on_change(self, type):
        for sub in self.subscribers:
            n = Notification(user_id=sub.user_id, post_id=self.id, type=type)
            db.session.add(n)


