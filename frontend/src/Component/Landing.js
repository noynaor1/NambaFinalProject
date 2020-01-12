import React, { Component } from 'react'
import axios from "axios";
import ReactPaginate from "react-paginate";
import moment from "moment";
import {Link} from "react-router-dom";

class Landing extends Component {
    state= {
        my_posts: [],
        my_posts_amount: 0,
        subscribed: [],
        subscribed_amount: 0
    }


  myPosts(){
        axios.defaults.withCredentials = true;
        axios.get('http://127.0.0.1:5000/myposts').then((response) => {
            this.setState({
                my_posts: response.data.posts,
                my_posts_amount: response.data.posts.length
            })
        }).catch(err => {
            console.log(err)
        });


  }


    createTable = (data) => {
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < data.length; i++) {
      //Create the parent and add the children
      table.push(<tr>
                    <td><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></td>
                <td><a href={"/users/"+data[i].id}>{'     '+data[i].title}</a></td>
              </tr>)
    }
    return table
  }

  componentDidMount() {
    if (localStorage.usertoken){
        this.myPosts();
    }
  }

  componentWillReceiveProps(){
        this.componentDidMount();
  }
  render() {

    if (localStorage.usertoken){
        let posts =  this.state.my_posts.map((post) => {
            return (
                <div className="col-md-24 mx-auto">
              <tr>
                    <td><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></td>
                <td> <img  className="rounded-circle account-img"
                                               src={"http://127.0.0.1:5000/static/profile_pics/default.jpg"}
                                               height="60" width="60"
                            />   <a href={"/users/"+post.id}>{'     '+post.title}</a></td>
              </tr>
                </div>

            );
        });

         return (
            <div className="container">
             <div style={{marginTop: "30px"}}>
               <div class="row">
                  <div class="column">
                        <div>
                 <table className="table col-md-6 mx-auto">
                    {this.createTable(this.state.my_posts)}
                 </table>

             </div>
                  </div>
                  <div class="column">
                    <h2>Column 2</h2>
                    <p>Some text..</p>
                  </div>
            </div>
          </div>
      </div>



         )
    }
    else{
        return (
      <div className="container">
        <div style={{marginTop: "30px"}}>
              <div class="row">
              <div class="column">
                <h2>Anonymous Column 1</h2>
                <p>Some text..</p>
              </div>
              <div class="column">
                <h2>Column 2</h2>
                <p>Some text..</p>
              </div>
            </div>
          </div>
      </div>


    )
    }


  }
}

export default Landing