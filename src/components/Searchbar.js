import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon, Button } from "semantic-ui-react";

class Searchbar extends Component {
  constructor(props) {
    super(props);

    this.state = { term: "" };

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({ term: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();

    // this.props.fetchPatient(this.state.term);
    this.setState({ term: "" });
  }

  render() {
    const { url } = this.props;
    if (!url) {
      return <div />;
    }
    return (
      <form
        className="ui form"
        onSubmit={this.onFormSubmit}
        style={{ width: "80%", margin: "20px auto 10px auto" }}
      >
        <div className="field center">
          <div
            className="ui input"
            style={{
              borderRadius: "30px",
              border: "1px solid lightgray",
              overflow: "hidden",
              backgroundColor: "white"
            }}
          >
            <input
              type="text"
              placeholder="Search with patient's name"
              value={this.state.term}
              onChange={this.onInputChange}
              style={{
                borderColor: "white"
              }}
            />
            <Link
              to={`${url}/search=${this.state.term}`}
              onClick={() => this.setState({ term: "" })}
            >
              <Button
                icon
                fluid
                type="submit"
                style={{
                  borderColor: "white",
                  backgroundColor: "white"
                }}
              >
                <Icon name="search" />
              </Button>
            </Link>
          </div>
        </div>
      </form>
    );
  }
}

export default Searchbar;
