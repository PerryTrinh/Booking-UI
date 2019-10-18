import React from "react";

import EventItem from "./eventitem/EventItem";
import "./EventList.css";

const eventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        userId={props.authUserId}
        creatorId={event.creator._id}
        price={event.price}
        date={event.date}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="event__list">{events}</ul>;
};

export default eventList;
