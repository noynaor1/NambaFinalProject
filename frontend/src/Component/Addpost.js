import React, { Component, useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import axios from "axios";

import Button from "react-bootstrap/Button";
import jwt_decode from "jwt-decode";
import Badge from "react-bootstrap/Badge";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";


export const post = newPost => {
  return axios
    .post('http://127.0.0.1:5000/addpost', {
      title: newPost.title,
      start_date: newPost.start_date,
      end_date: newPost.end_date,
      country: newPost.country,
      city: newPost.city,
      content: newPost.content
    })
    .then(response => {
        return response.data
    })
}

export class Addpost extends Component{

  constructor() {
    super()
    this.state = {
      title: '',
      start_date: new Date(),
      end_date: new Date(),
      country: '',
      city: '',
      content: ''

    }
    this.onChange  = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleStartDateChange = date => {
    this.setState({
      start_date: date
    });
    if (date > this.state.end_date){
        this.setState({end_date: date})
    }

  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

   onSubmit(e){
      e.preventDefault()
      const newPost = {
          title: this.state.title,
          start_date: this.state.start_date,
          end_date: this.state.end_date,
          country: this.state.country,
          city: this.state.city,
          content: this.state.content
       }
      post(newPost).then(res => {
             this.props.history.push(`/`)
      })
   }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Travel Post</h1>
              <div className="form-group">
                <label htmlFor="name">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Enter trip title"
                  value={this.state.title}
                  onChange={this.onChange}
                  noValidate
                />
              </div>
              <div className="form-group">

              <table>
                <tr>
                    <td style={{width:"250px"}}>
                        <label htmlFor="name">Start date</label><br></br>
                        <DatePicker
                         name="start_date"
                         selected={this.state.start_date}
                         onChange={this.handleStartDateChange}
                         dateFormat="dd/MM/yyyy"
                         minDate = {new Date()}
                        />
                    </td>
                    <td style={{width:"250px"}}>
                         <label htmlFor="name">End date</label><br></br>
                        <DatePicker
                         name="end_date"
                         selected={this.state.end_date}
                         onChange={date => { this.setState({end_date: date})}}
                         dateFormat="dd/MM/yyyy"
                         minDate = {this.state.start_date}
                        />
                    </td>
                </tr>
              </table>

              </div>

              <div className="form-group">
                <label htmlFor="name">Country</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  placeholder="Enter country"
                  value={this.state.country}
                  onChange={this.onChange}
                  noValidate
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  placeholder="Enter city"
                  value={this.state.city}
                  onChange={this.onChange}
                  noValidate
                />
              </div>
              <div className="form-group">
                <textarea name="content" placeholder="Trip description" cols="70" rows="5" value={this.state.content} onChange={this.onChange}></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Post!
              </button>
            </form>
          </div>
        </div>
      </div>

    )
  }
}

export default Addpost;