import React from "react";
import "../styles/team-members-cards.scss";

export default function TeamMembersCards({ data }) {
  return (
    <div className="tm-cards">
      {data.map((item, index) => (
        <div
          key={index}
          className="tm-cards__card"
          style={{ backgroundImage: `url(${item.image})` }}
          data-aos="fade-in"
          data-aos-delay={index*100}
        >
          <div className="tm-cards__card-info">
            <h3 className="tm-cards__card-name">{item.name}</h3>
            <p className="tm-cards__card-role">{item.role}</p>
            <p className="tm-cards__card-description">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
