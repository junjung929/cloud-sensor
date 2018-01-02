import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Input = styled.input`
    width: 70%;
    display: inline-block;
    border-radius: 5px 0px 0px 5px;
    font-size: inherit`
const Button = styled.button`
    border-radius: 0px 5px 5px 0px;
    margin-left: -1px;
    vertical-align: top`
const Form = styled.form`
    width: 100%;`
class Searchbar extends Component {
    constructor(props){
        super(props);

        this.state={ term: '' };

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onInputChange(event) {
        this.setState({ term: event.target.value });
    }

    onFormSubmit(event) {
        event.preventDefault();

        // this.props.fetchPatient(this.state.term);
        this.setState({ term: '' });
    }

    render() {
        const { url } = this.props;
        if(!url){return(<div/>)}
        return (
            <Form onSubmit={this.onFormSubmit}>
                    <Input 
                        placeholder="Search with patient's name"
                        className="form-control"
                        value={this.state.term}
                        onChange={this.onInputChange} />
                    <span>
                        <Link to={`${url}/search=${this.state.term}`} onClick={() => this.setState({ term: ''})} >
                            <Button type="submit" className="btn btn-default"> <span className="glyphicon glyphicon-search"></span></Button>
                        </Link>
                    </span>
            </Form>
        );
    }
}


export default Searchbar;