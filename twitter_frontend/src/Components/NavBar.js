import React, {Component} from "react";
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import Typography from 'material-ui/Typography';

import {AppBar} from 'material-ui';
import Toolbar from 'material-ui/Toolbar';

import Button from 'material-ui/Button';

import Menu, { MenuItem } from 'material-ui/Menu';
import Input from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import MessageBar from './MessageBar';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';

const styles = {
    root: {
        flexGrow: 1,
      },
      flex: {
        flex: 1,
      },
    navbar: {
        height: 60,
        backgroundColor: "#fff",
        overflow: "hidden"
    },
    title: {
        color: "#00aced",
        cursor: "pointer",
    },
    tabs: {
        float: "right",
        color: "#000",
        marginRight: "0",
    },
    tab: {
        inkbar: "green", 
        underline: "#fff"
    },
    buttonGroup: {
        flex: 1,
        marginLeft: 10
    },
    tweetButton: {
        backgroundColor: "#00aced",
        color: "#fff"
    },
    profileMenuButton: {
        marginRight: 5
    },
    input: {
        marginRight: 5
    },
};

class NavBar extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };

    constructor(props) {
        
        super(props);
        
        const { cookies } = this.props;

        this.state = {
            value : 0,
            anchorEl: null,
            tweet_box_open: false,
            tweet_content: "",
        }

    }

    handleTweetBoxOpen = () => {
        console.log("HERE!");
        this.setState({tweet_box_open: true });
    };

    handleTweetBoxClose = () => {
        this.setState({ tweet_box_open: false });
    };

    goToIndex = e => {
		window.location = '/';
    }

    goToHome = e => {
		window.location = '/home';
    }

    goToMessages = e => {
		window.location = '/messages';
    }
    
    goToProfile = e => {
		window.location = '/profile';
    }

    goToSettings = e => {
		window.location = '/settings';
    }

    goToNotif = e => {
		window.location = '/notifications';
    }
    
    handleChange = (event, value) => {
        this.setState({ value });
        event.preventDefault();
    };

    handleClick = e => {
        this.setState({ anchorEl: e.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () =>  {
        const { cookies } = this.props;
        axios.get(
        'http://localhost:3000/users/logout'
        ).then(response => {
            cookies.remove('session_id');
            this.goToIndex();
        })
      }

    validateForm = () => {
        if(this.state.tweet_content) 
            return true;
        else return false;
    }

    handleNewTweet = (e, reply_to) => {
        
        if(!this.validateForm()){
          this.MessageBar.showSnackbar("Tweet box can't be empty!")
        }else{
            

            // fetch('http://localhost:3000/tweets/new?tweet=sasdsad&reply_to=12312', {
            //     headers: new Headers({
            //         'Content-Type': 'application/json'
            //       }), 
            //   })
            // .then(response => response.json())
            // .then(result => console.log("fetch: "+result));


          axios.get(
            'http://localhost:3000/tweets/new',
            {
              params: {
                'tweet':this.state.tweet_content, 
                'reply_to': reply_to,
              }
            }
          ).then(response => {
            console.log("axios:"+JSON.stringify(response))
            if(!response.data.result.success){
              this.MessageBar.showSnackbar(response.data.result.error.message)
            }else{
              this.MessageBar.showSnackbar("Tweet Posted!");
              this.handleTweetBoxClose();
            }
          })
        }
        e.preventDefault();
    }

    updateTweetContent = (e) => {
        this.setState({
            tweet_content: e.target.value
        })
    }

    render() {
        return (
            <AppBar style={styles.navbar}>
                <MessageBar ref={instance => { this.MessageBar = instance; }}/>
                <Toolbar>
                    <Typography 
                        variant="title" 
                        style={styles.title} 
                        onClick = {this.goToHome}>
                        Twitter
                    </Typography>
                    <div style={styles.buttonGroup} >
                        <Button onClick = {this.goToHome}>Home</Button>
                        <Button onClick = {this.goToNotif}>Notifications</Button>
                        <Button onClick = {this.goToMessages}>Messages</Button>
                    </div>
                    <Input
                        placeholder="Search Twitter"
                        style={styles.input}
                    />
                    <div style={styles.profileMenuButton}>
                        <Button
                        aria-owns={this.state.anchorEl ? 'simple-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        >
                        Tai Cow
                        </Button>
                        <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                        >
                            <MenuItem onClick = {this.goToProfile}>Profile</MenuItem>
                            <MenuItem onClick={this.goToSettings}>Settings</MenuItem>
                            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                    <Button 
                        style={styles.tweetButton} 
                        onClick={this.handleTweetBoxOpen}>Tweet</Button>
                    <Dialog
                        open={this.state.tweet_box_open}
                        onClose={this.handleTweetBoxClose}
                        aria-labelledby="form-dialog-title"
                        >
                        <DialogTitle id="form-dialog-title">New Tweet</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            {/* What's on your mind? */}
                            </DialogContentText>
                            <TextField
                            autoFocus
                            margin="dense"
                            id="tweet"
                            label="What's on your mind?"
                            type="email"
                            value={this.state.tweet_content}
                            onChange={this.updateTweetContent}
                            fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleTweetBoxClose} color="primary">
                            Video/Photo
                            </Button>
                            <Button onClick={this.handleTweetBoxClose} color="primary">
                            Cancel
                            </Button>
                            <Button onClick={this.handleNewTweet} color="primary">
                            Tweet!
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withCookies(NavBar);