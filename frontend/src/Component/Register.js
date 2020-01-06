import React, { Component } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import Alert from "reactstrap/es/Alert";
import axios from "axios";

export const register = newUser => {
  return axios
    .post('http://127.0.0.1:5000/user/new', {
      username: newUser.username,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      gender: newUser.gender,
      birth_date: newUser.birth_date,
      email: newUser.email,
      password: newUser.password
    })
    .then(response => {
        return response.data
    })
}


const validEmailRegex =
  RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class Register extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      first_name: '',
      last_name: '',
      gender: '',
      birth_date: new Date(),
      email: '',
      password: '',
      errors: {
          username: '',
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          gender: 'Please choose your gender',
      },
      user_taken: 0,
      email_taken: 0,
      invalid: 0
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleChange = date => {
    this.setState({
      birth_date: date
    });
  };
  onChange(e) {
      //  e.preventDefault()
        let errors = this.state.errors;
        const { name, value } = e.target;
        this.setState({ [e.target.name]: e.target.value });

        switch (name) {
            case 'username':
                this.setState({user_taken: 0});
                errors.username =
                  value.length < 1 || value.length > 20
                    ? 'Username is not valid!'
                    : '';
                break;
            case 'gender':
                errors.gender='';
                break;
            case 'email':
                this.setState({email_taken: 0});
                errors.email =
                  validEmailRegex.test(value)  && value.length <= 120
                    ? ''
                    : 'Email is not valid!';
                break;
              case 'password':
                errors.password =
                  value.length < 1 || value.length > 60
                    ? 'Password is not valid!'
                    : '';
                break;
                case 'first_name':
                errors.first_name =
                  value.length > 20
                    ? 'First name is too long'
                    : '';
                break;
                case 'last_name':
                errors.last_name =
                  value.length > 20
                    ? 'Last name is too long'
                    : '';
                break;
              default:
                break;
        }
        this.setState({errors, [name]: value});
  }
  onSubmit(e) {
    e.preventDefault()
    this.setState({invalid: 0});
    this.setState({user_taken: 0});
    this.setState({email_taken: 0});

    const newUser = {
      username: this.state.username,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      gender: this.state.gender,
      birth_date: this.state.birth_date,
      email: this.state.email,
      password: this.state.password
    }

     if (validateForm(this.state.errors)) {
         register(newUser).then(res => {
             if (res == 'Created') {
                 this.props.history.push(`/login`)
             }
             if (res == 'Username Taken'){
                 this.setState({user_taken: 1});
                 this.setState({invalid: 1});
             }
             if (res == 'Email Taken'){
                 this.setState({email_taken: 1});
                 this.setState({invalid: 1});
             }
         })
     }
     else{
         this.setState({invalid: 1});
     }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                  {this.state.invalid >0 &&  <Alert color="danger">
                  Your registration is invalid. Please try again!
                </Alert> }
                <label htmlFor="name">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={this.onChange}
                  noValidate
                />
                 {this.state.errors.username.length > 0 &&
                <span className='error'>{this.state.errors.username}</span>}
                {this.state.user_taken > 0 &&
                <span className='error'>This username is taken</span>}
              </div>
              <div className="form-group">
                <label htmlFor="name">First name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={this.state.first_name}
                  onChange={this.onChange}
                  noValidate
                />
                {this.state.errors.first_name.length > 0 &&
                <span className='error'>{this.state.errors.first_name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="name">Last name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={this.state.last_name}
                  onChange={this.onChange}
                  noValidate
                />
                 {this.state.errors.last_name.length > 0 &&
                <span className='error'>{this.state.errors.last_name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="name">Gender</label><br></br>
                <input type="radio" name="gender" value="Male" onChange={this.onChange}/> Male<br></br>
                <input type="radio" name="gender" value="Female" onChange={this.onChange}/> Female<br></br>
                <input type="radio" name="gender" value="other" onChange={this.onChange}/> Other
              </div>
                 {this.state.errors.gender.length > 0 &&
                <span className='error'>{this.state.errors.gender}</span>}
              <div className="form-group">
                  <label htmlFor="name">Birth date</label><br></br>
                <DatePicker
                 name="birth_date"
                 selected={this.state.birth_date}
                 onChange={this.handleChange}
                 dateFormat="dd/MM/yyyy"
                 maxDate={new Date()}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                  noValidate
                />
                  {this.state.errors.email.length > 0 &&
                <span className='error'>{this.state.errors.email}</span>}
                 {this.state.email_taken > 0 &&
                <span className='error'>This email is taken</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  noValidate
                />
                  {this.state.errors.password.length > 0 &&
                <span className='error'>{this.state.errors.password}</span>}
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Register!
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Register