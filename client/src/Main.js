import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './main.css';
import './animation.css';

class Main extends Component {
  state = { }

  handleForm(event) { event.preventDefault(); return false;}

  // puts correct body styling
  componentDidMount() {
    document.body.id = 'main-body';
    this.getCourses();
    document.querySelector('#desktop-course-finder').addEventListener('change', this.myFunction);
  }

  myFunction(value) {
    alert(value); //to avoid alert spam...
  }


  getCourses = () => {
    // Get the message and store in state
    fetch('/api/courses/')
      .then(res => res.json())
      // .then(course => this.setState({courses: JSON.stringify(course)}));
      .then(course => this.setState({courses: this.handleCourses(course)}));
  }

  handleCourses(course) {
    var innerHTMLChange = "";
    for(var i = 0; i < course.length; i++) {
      innerHTMLChange = innerHTMLChange + "<div class=\"class slideRight\"><div class=\"pin glyphicon glyphicon-pushpin\" />" + "</div>";
      innerHTMLChange = innerHTMLChange + "<h1 class=\"class-title\">" + course[i]['department'] + course[i]['courseNumber'] + "</h1>";
      innerHTMLChange = innerHTMLChange + "<h2 class=\"hidden-sm\">" + course[i]['name'] + "</h2>" + "</div>";
    }
    // console.log(document.getElementById('desktop-course-finder').value);
    document.getElementById("class-placement").innerHTML += innerHTMLChange;
    // return JSON.stringify(course);
    // return "<p>YOOO!!!</p>"
  }

  // removes the body styling when on a different page
  componentWillUnmount() {
    document.body.id = '';
  }

  // renders the landing page
  render() {
    return (
      <div className="main-component-outer-div">
        <nav className="navbar navbar-fixed-top">
          <div class="container-fluid">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <form class="navbar-form navbar-toggle">
                <div class="form-group">
                  <input type="text" class="form-control" id="search-box-1" placeholder="Find your class! (e.g. MAT103)" name="search"></input>
                </div>
              </form>
              <a class="navbar-brand hidden-xs" href="#">TigerConnect</a>
              <a class="navbar-brand visible-xs" href="#">TC</a>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
              <ul class="nav navbar-nav">
              </ul>
              <ul class="nav navbar-nav navbar-right">
                <li><a href="#"><span class="glyphicon glyphicon-envelope"></span> Notifications</a></li>
                <li><a href="#"><span class="glyphicon glyphicon-cog"></span> Settings</a></li>
                <li><a href="/"><span class="glyphicon glyphicon-off"></span> Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="side-and-main">
                <div className="side-and-main-bg" />
                <div className="sidenav hidden-xs" id="class-placement">
                  <div className="search-divider">
                      <div className="input-group">
                        <input type="text" value="hihi" className="form-control" id="desktop-course-finder" placeholder="Find your class! (e.g. MAT103)" name="search" aria-describedby="basic-addon2"/>
                        <span className="input-group-addon glyphicon glyphicon-search" id="basic-addon2" />
                      </div>
                  </div>
                  <div className="placeholder"/>
                    {this.state.courses}
                  {/*
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" />
                    <h1 className="class-title">MAT103</h1>
                    <h2>Calculus I</h2>
                    <br />
                    <h2>1 p-set group online</h2>
                  </div>
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div>
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div>
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div>
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div>
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div>
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div>
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div> */}
                </div>
                <div className="main-panel">
                  <div className="group-container"><div className="group slideUp"><div className="group-header"><p className="group-header-text">lol mathmathmath</p></div><button className="join">JOIN</button></div></div>
                  <div className="group-container"><div className="group slideUp"><div className="group-header"><p className="group-header-text">pset mat103 tonight</p></div><button className="join">JOIN</button></div></div>
                  <div className="group-container"><div className="group slideUp"><div className="group-header"><p className="group-header-text">LETS WORK ON STUFF</p></div><button className="join">JOIN</button></div></div>
                  <div className="group-container"><div className="group slideUp"><div className="group-header" /><button className="join">JOIN</button></div></div>
                  {/* <div class="connect-circle"></div> */}
                  <p> Connect with other students on P-Set Problems! </p>
                  <ol>
                    <li>Search up the class that you're in!</li>
                    <li>Look for groups that other people have set up!</li>
                    <li>Join or make your own!</li>
                  </ol>
                </div>
              </div>
      </div>
    );
  }
}

export default Main;
