import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Profile = (props) => {

    return (
        <div className="col-sm-4">
            <div className="text-center">
                <img src="https://www.planwallpaper.com/static/images/04c05a04079a978b0ffa50a1ae42f5a6.jpg" className="img-circle" style={{width:150, height:150}} />
                <h3 className=""><strong>{props.content.name}</strong></h3>
                <p>{props.content.address}</p>
                <p>{props.content.phone_number}</p>
                <Link to={props.link} className="btn btn-default">Go</Link>
            </div>
        </div>
    );
}
export default Profile;