import React, { Component } from "react";
import "./App.css";

export default class App extends Component {
  //setting state spamList , message.
  state = {
    spamList: null,
    message: null,
  };
  //componentDidMount() is used to fetch all the data using GET/POST method.
  async componentDidMount() {
    //GET method to get all the data.
    const url =
      "https://2wu6rkioq5.execute-api.us-east-2.amazonaws.com/test/reports";
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    this.setState({ spamList: data });
  }
  //when onclick to block or resolve .
  resolveTicket = async (element) => {
    //setting ticketNum(id) , ticketState(state i.e, open,closed or block).
    var ticketNum = element.target.className;
    var ticketState = null;
    //To check if the innerHTML is Resolve or Block.
    if (element.target.innerHTML === "Resolve") {
      ticketState = "CLOSED";
    } else if (element.target.innerHTML === "Block") {
      ticketState = "BLOCK";
    }
    //PUT method to update the table.
    const response = await fetch(
      `https://2wu6rkioq5.execute-api.us-east-2.amazonaws.com/test/reports/${ticketNum}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ticketState: `${ticketState}`,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    //Print message to show which button is clicked and status of the ticket.
    if (response.status === 200) {
      this.setState({
        message: `Ticket ${ticketNum} was successfully updated as ${ticketState}`,
      });
      this.componentDidMount();
    } else {
      console.log(
        `TicketStatus for spam ${element.target.className} was not updated successfully. Please try again`
      );
    }
  };
  //render function to return.
  render() {
    //checks spamList and prints "Loading.." until spamList is NULL.
    if (!this.state.spamList) {
      return <div>Loading..</div>;
    }
    //else i.e, if spamList is NOT NULL.
    return (
      <div>
        <div className="report">
          <h1>Reports</h1>
          <p>{this.state.message}</p>
          {this.state.spamList.map((spam) => {
            return (
              <div className="spam">
                <div className="left">
                  <p>
                    Id : <span>{spam.id}</span>
                  </p>
                  <p>
                    State : <span>{spam.state}</span>
                  </p>
                  <p>
                    <a href="">Details</a>
                  </p>
                </div>
                <div className="center">
                  <p>
                    Type : <span>{spam.payload_reportType}</span>
                  </p>
                  <p>
                    Message :{" "}
                    <span>
                      {spam.payload_message != null
                        ? spam.payload_message
                        : "N/A"}
                    </span>
                  </p>
                </div>
                <div className="right">
                  <button className={spam.id} onClick={this.resolveTicket}>
                    Block
                  </button>
                  <button className={spam.id} onClick={this.resolveTicket}>
                    Resolve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
