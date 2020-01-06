import React, { Component } from 'react'
import Alert from "reactstrap/es/Alert";
import axios from "axios";


export const login = user => {
  axios.defaults.withCredentials = true;
  return axios
      .post('http://127.0.0.1:5000/login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        localStorage.setItem('usertoken', response.data)
        return response.data
      })
      .catch(err => {
        console.log(err)
        return 'error'
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
class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      errors: {
        email: '',
        password: '',
      },
      invalid: 0

    };

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
    const { name, value } = e.target;
    let errors = this.state.errors;

    switch (name) {
      case 'email':
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
      default:
        break;
    }
    this.setState({errors, [name]: value});
  }


  onSubmit(e) {
    e.preventDefault();
    this.setState({invalid: 0});
    const user = {
      email: this.state.email,
      password: this.state.password
    }

    if(validateForm(this.state.errors)) {
      login(user).then(res => {
      if (res != 'error') {
        this.props.history.push(`/`)
      }
      else {
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
              <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>
              <div className="form-group">
                {this.state.invalid >0 &&  <Alert color="danger">
                  Invalid email or password. Please try again!
                </Alert> }
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
                  noValidate />
                  {this.state.errors.password.length > 0 &&
                    <span className='error' >{this.state.errors.password}</span>}
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login