$(document).ready(() => {
    $("#modal-button").click(() => {
        $(".modal-body").html("");
        $.get(`/api/courses`, (results = {}) => {
            let data = results.data;
            if (!data || !data.courses) return;
            data.courses.forEach((course) => {
                $(".modal-body").append(
                    `<div class="course-item">
                        <div class="course-icon">🍳</div>
                        <div class="course-details">
                            <h4 class="course-title">${course.title}</h4>
                            <p class="course-description">${course.description}</p>
                        </div>
                        <div class="course-actions">
                            <button class="${course.joined ? "joined-button" : "join-button"} btn btn-sm" data-id="${course._id}">
                                ${course.joined ? "Joined" : "Join"}
                            </button>
                            <span class="course-cost">$${course.cost}</span>
                        </div>
                    </div>`
                );
            });
        }).then(() => {
            addJoinButtonListener();
        });
    });
});

let addJoinButtonListener = () => {
    $(".join-button").click((event) => {
        let $button = $(event.target),
            courseId = $button.data("id");
        $.get(`/api/courses/${courseId}/join`, (results = {}) => {
            let data = results.data;
            if (data && data.success) {
                $button
                    .text("Joined")
                    .addClass("joined-button")
                    .removeClass("join-button");
            } else {
                $button.text("Try again");
            }
        });
    });
};