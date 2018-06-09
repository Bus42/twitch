// Global variables
var baseUrl = "https://wind-bow.gomix.me/twitch-api/";
var streamers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "habathcx", "RobotCaleb", "GeoffStorbeck", "terakilobyte", "notmichaelmcdonald", "medrybw", "thomasballinger", "noobs2ninjas", "beohoff"];
var cb = "?callback=?";

var sorry = function () {
    alert("Sorry, this app is still under construction and it looks like this feature isn't ready yet. Please try another.");
}

// button functions

var clearActive = function () {
    if ($("#all").hasClass("active") === true) {
        $("#all").removeClass("active");
    }
    if ($("#live").hasClass("active") === true) {
        $("#live").removeClass("active");
    }
    if ($("#userSearch").hasClass("active") === true) {
        $("#userSearch").removeClass("active");
    }
}

var fetchAll = function () {
    streamers.forEach(function (index) {
        var streamStatus = "<p class='text-warning'>Not currently streaming</p>";
        $.getJSON(baseUrl + "streams/" + index + cb, function (data) {
            if (data.stream !== null && data.stream !== undefined) {
                streamStatus = "<a href='" + data.stream.channel.url + "'><p class='text-success'>Currently streaming " + data.stream.game + "</p></a>";
            }
        });
        $.getJSON(baseUrl + "channels/" + index + cb, function (data) {
            if (data.status !== 404 && data.status !== null) {
                $("#target").append("<figcaption><a href='" + data.url + "' target='" + data._id + "'><img id='" + index + "' class='img-circle animated zoomIn' src='" + (data.logo || "https://pbs.twimg.com/profile_images/805521574484840448/_9RYPieB_400x400.jpg") + "' alt='" + data.display_name + " logo'></a><h2 class='text-primary'>" + data.display_name + "</h2><p class='text-info'>Views <span class='badge'>" + data.views + "</span></p><p class='text-info'>Followers <span class='badge'>" + data.followers + "</span></p><p>" + data.status + "</p>" + streamStatus + "</figcaption>");
            }
        });
    });
};

$("#all").click(function () {
    $("#search").hide();
    clearActive();
    $("#all").addClass("active");
    $('#target').html("");
    $("#loading").toggle(function () {
        fetchAll();
        $("#loading").toggle();
    });
});
$("#live").click(function () {
    $("#search").hide();
    clearActive();
    $("#live").addClass("active");
    $('#target').html("");
    $("#loading").toggle(function () {
        streamers.forEach(function (index) {
            var obj = {};
            $.getJSON(baseUrl + "streams/" + index + cb, function (data) {
                var isStreaming = (data.stream === null || data.stream === undefined) ? false : true;
                if (isStreaming === true) {
                    $("#target").append("<figcaption><a href='" + data.stream.channel.url + "' target='" + data.stream._id + "'><img class='img-circle animated zoomIn' src='" + data.stream.channel.logo + "' alt='" + data.stream.channel.display_name + " logo'></a><h2 class='text-primary'>" + data.stream.channel.display_name + "</h2><h3 class='text-primary'>" + data.stream.game + "</h3><p class='text-info'>Viewers <span class='badge'>" + data.stream.viewers + "</span></p><p class='text-info'>Followers <span class='badge'>" + data.stream.channel.followers + "</span></p></figcaption>");
                }
            });
        });
        $("#loading").toggle();
    });
});
$("#userSearch").click(function () {
    clearActive();
    $("#userSearch").addClass("active");
    $('#target').html("");
    $("#search").show();
});

var searchUsers = function () {
    $('#target').html("");
    var searches = [];
    var searchInput = $("#searchInput").val();
    if (searchInput === [] || searchInput === null || searchInput === undefined || searchInput.length < 1) {
        alert("Please enter a name or names to search for.");
    }
    $("#loading").toggle(function () {
        var searchTerms = searchInput.replace(/\s+/g, '');
        searches = searchTerms.split(",");
        searches.forEach(function (index) {
            var streamStatus = "<p class='text-warning'>Not currently streaming</p>";
            $.getJSON(baseUrl + "streams/" + index + cb, function (data) {
                if (data.stream !== null && data.stream !== undefined) {
                    streamStatus = "<a href='" + data.stream.channel.url + "'><p class='text-success'>Currently streaming " + data.stream.game + "</p></a>";
                }
            });
            $.getJSON(baseUrl + "channels/" + index + cb, function (data) {

                if (data.status !== 404 && data.status !== null) {
                    if (data.logo) {
                        logo = data.logo;
                    } else {
                        logo = "http://orig13.deviantart.net/5a5c/f/2013/084/0/b/0b468bb23e287b5cb6c10427b5acc06f-d5z782y.jpg";
                    };
                    $("#target").append("<figcaption><a href='" + data.url + "' target='" + data._id + "'><img class='img-circle animated zoomIn' src='" + logo + "' alt='" + data.display_name + " logo'></a><h2 class='text-primary'>" + data.display_name + "</h2><p class='text-info'>Views <span class='badge'>" + data.views + "</span></p><p class='text-info'>Followers <span class='badge'>" + data.followers + "</span></p><p>" + data.status + "</p>" + streamStatus + "</figcaption>");
                } else {
                    $("#target").append("<figcaption class='error'><img class='img-circle animated zoomIn' src='https://upload.wikimedia.org/wikipedia/commons/4/4f/New_Mexico_404.svg' alt='data not found icon'><h2 class='text-danger'>Sorry! <br><small>We couldn't find " + index + "</small></h2><p>This user may no longer exist or may not have a valid Twitch.tv account. Please check your spelling and try again.</p><br><span class='pull-right glyphicon glyphicon-remove-circle'></span></figcaption>");
                }
                $(".glyphicon-remove-circle").click(function () {
                    $(this).parent().css('display', 'none');
                })
            });
        });
        $("#loading").toggle();
    });
    $("#searchInput").val("");
}

$("#searchForm").submit(searchUsers);
$("#searchButton").click(searchUsers);

$(document).ready(function () {
    fetchAll();
});
