import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './main.css';
import './animation.css';

class Main extends Component {
  // puts correct body styling
  componentDidMount() {
    document.body.id = 'main-body';
  }

  // removes the body styling when on a different page
  componentWillUnmount() {
    document.body.id = '';
  }

  // renders the landing page
  render() {
    return (
      <div className="main-component-outer-div">
        <nav class="navbar navbar-fixed-top">
          <div class="container-fluid">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <form class="navbar-form navbar-toggle"  action="/action_page.php">
                <div class="form-group">
                  <input type="text" class="form-control" placeholder="Find your class! (e.g. MAT103)" name="search"></input>
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
                <li><a href="#"><span class="glyphicon glyphicon-off"></span> Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="side-and-main">
                <div className="side-and-main-bg" />
                <div className="sidenav hidden-xs">
                  <div className="search-divider">
                    <form className="sidebar-form" action="/action_page.php">
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="Find your class! (e.g. MAT103)" name="search" aria-describedby="basic-addon2" />
                        <span className="input-group-addon glyphicon glyphicon-search" id="basic-addon2" />
                      </div>
                    </form>
                  </div>
                  <div className="placeholder" />
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
                  <div className="class slideRight"><div className="pin glyphicon glyphicon-pushpin" /></div>
                </div>
                <div className="main-panel">
                  <div className="group-container"><div className="group slideUp">
                      <div className="group-header" />
                      <p>JOIN MAT103 PSET GROUP!!!!</p>
                      <button className="join">JOIN</button>
                    </div>
                  </div>
                  <div className="group-container"><div className="group slideUp"><div className="group-header"><p>pset mat103 tonight</p></div>
                      <p>Author: jedouard</p>
                      <p>Course: MAT103</p>
                      <p>Description: stuff's due tonight let's hurry up and get on it lol</p>
                      <p>3/5 people joined!</p>
                      <button className="join">JOIN</button>
                    </div>
                  </div>
                  <div className="group-container"><div className="group slideUp"><div className="group-header"><p>LETS WORK ON STUFF</p></div><p>Author: jedouard</p><button className="join">JOIN</button></div></div>
                  <div className="group-container"><div className="group slideUp"><div className="group-header" /><p>pset mat103</p><button className="join">JOIN</button></div></div>
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
