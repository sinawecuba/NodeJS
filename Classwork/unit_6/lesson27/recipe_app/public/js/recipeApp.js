$(document).ready( () => {
  $("#modal-button").click( () => {
    $(".modal-body").html("");
    $.get("/api/courses", (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return; //Check data object contains course information
      data.courses.forEach( (course) => {
        $(".modal-body").append(
          `<div>
          <span class="course-title">
          ${course.title}
          </span>
          <button class= '${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}"> ${course.joined ? "Joined" : "Join"}</button>
          <div class="course-description">
          ${course.description}
          </div>         
          </div>`
        );
      });
    }).then( () => {
      addJoinButtonListener();
    });
  });
});

//$ indicates that it represents a jQuery object
let addJoinButtonListener = () => {
  $(".join-button").click( (event) => {
    let $button = $(event.target);
    let courseId = $button.data("id");
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) { //join action successful
        $button.text("Joined")
        .addClass("joined-button")
        .removeClass("join-button");
      } else {
        $button.text("Sorry, please login. Then try again");
      }
    });
  });
}
