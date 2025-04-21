import React from "react";
import "./Courses.css";

const languageCourses = [
  {
    id: 1,
    cover: "images/english.jpg",
    language: "Anglais",
    teacher: {
      name: "Ahmed ben said",
      photo: "images/back.webp",
      totalTime: "40h",
    },
    price: "750d",
  },
  {
    id: 2,
    cover: "images/french.jpg",
    language: "Français",
    teacher: {
      name: "Marie Dubois",
      photo: "images/teacher2.jpg",
      totalTime: "35h",
    },
    price: "750d",
  },
  {
    id: 3,
    cover: "images/arabic.jpg",
    language: "Arabe",
    teacher: {
      name: "Omar Al-Farsi",
      photo: "images/teacher3.jpg",
      totalTime: "50h",
    },
    price: "750€",
  },
  {
    id: 4,
    cover: "images/german.jpg",
    language: "Allemand",
    teacher: {
      name: "Islem jbeli",
      photo: "images/teacher4.jpg",
      totalTime: "45h",
    },
    price: "750d",
  },
  {
    id: 5,
    cover: "images/portuguese.jpg",
    language: "Portugais",
    teacher: {
      name: "Carlos Silva",
      photo: "images/teacher5.jpg",
      totalTime: "30h",
    },
    price: "750d",
  },
  {
    id: 6,
    cover: "images/italian.jpg",
    language: "Italien",
    teacher: {
      name: "Giulia Rossi",
      photo: "images/teacher6.jpg",
      totalTime: "38h",
    },
    price: "750",
  },
];

const Courses = () => {
  return (
    <section className="coursesCard">
      <div className="container grid2">
        {languageCourses.map((course) => (
          <div className="items" key={course.id}>
            <div className="content flex">
              <div className="left">
                <div className="img">
                  <img src={course.cover} alt={course.language} />
                </div>
              </div>
              <div className="text">
                <h1>{course.language}</h1>
                <div className="details">
                  <div className="box">
                    <div className="dimg">
                      <img src={course.teacher.photo} alt={course.teacher.name} />
                    </div>
                    <div className="para">
                      <h4>{course.teacher.name}</h4>
                    </div>
                  </div>
                  <span>{course.teacher.totalTime}</span>
                </div>
              </div>
            </div>
            <div className="price">
              <h3>{course.price}</h3>
            </div>
            <button className="outline-btn">S'INSCRIRE</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses;
