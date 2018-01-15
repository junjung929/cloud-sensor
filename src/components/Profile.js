import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Profile = (props) => {
    const { content, link } = props;
    return (
        <div className="col-sm-4">
            <div className="text-center">
                <img src={content.imgSrc} className="img-circle" style={{width:150, height:150}} />
                <h3 className=""><strong>{content.name}</strong></h3>
                <p>{content.address}</p>
                <p>{content.phone_number}</p>
                <Link to={link} className="btn btn-default">Go</Link>
            </div>
        </div>
    );
}
export default Profile;