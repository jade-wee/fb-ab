$(document).ready(function() {
  $( function() {
    $( "#startdate" ).datepicker();
    $( "#enddate" ).datepicker();
  } );

  $(".main").hide();
  $(".dateError").hide();
  $(".group-a").hide();
  $(".group-b").hide();
  $(".successResponse").hide();
  $(".errorResponse").hide();

  $(".slider").click(function() {
    if($('.group-container-wrapper').is(':visible')) {
      $('.group-container-wrapper').slideUp('slow');
    } else {
      $('.group-container-wrapper').slideDown('slow');
      $("html, body").animate({ scrollTop: $(document).height() }, 'slow');
    }
  });

  $("form").submit(function(e){
    e.preventDefault();
    validateForm();
  });

  function validateForm() {
    var passed = true;

    if ($("#name").val() === "" || $("#description").val() === "" || $("#startdate").val() === "" || $("#enddate").val() === "" || $("#type_dropdown").val() === null || $("#country_dropdown").val() === null) {
      passed = false;
      $(".main").show();
    } else {
      $(".main").hide();
    }

    if ($("#startdate").val() !== "" || $("#enddate").val() !== "") {
      var tempStart = new Date($("#startdate").val());
      var startDate = tempStart.getTime();

      var tempEnd = new Date($("#enddate").val());
      var endDate = tempEnd.getTime();

      if (endDate <= startDate) {
        passed = false;
        $(".dateError").show();
      } else {
        $(".dateError").hide();
      }
    }

    if ($("#name1").val() === "" || $("#id1").val() === "") {
      passed = false;
      $(".group-a").show();
    } else {
      $(".group-a").hide();
    }

    if ($("#name2").val() === "" || $("#id2").val() === "") {
      passed = false;
      $(".group-b").show();
    } else {
      $(".group-b").hide();
    }

    if (passed) {
      processData();
    } else {
      $(".success").hide();
      $(".error").hide();

      $('html,body').animate({ scrollTop: 0 }, 'slow');

      return false;
    }
  }

  function processData() {
    var tempStart = new Date($("#startdate").val());
    var startDate = tempStart.getTime();

    var tempEnd = new Date($("#enddate").val());
    tempEnd.setDate(tempEnd.getDate() + 1);
    var endDate = tempEnd.getTime();

    var audience = 50;
    if ($("#name3").val() !== "" && $("#id3").val() !== "") {
      audience = 100/3;
      audience.toFixed(2);
    }
    if ($("#name4").val() !== "" && $("#id4").val() !== "") {
      audience = 25;
      audience.toFixed(2);
    }

    var cells_obj = [];
    if ($("#type_dropdown").val() === "adsets") {
      cells_obj.push({name: $("#name1").val(), treatment_percentage: audience, adsets: [parseInt($("#id1").val())]}, {name: $("#name2").val(), treatment_percentage: audience, adsets: [parseInt($("#id2").val())]});
    } else {
      cells_obj.push({name: $("#name1").val(), treatment_percentage: audience, campaigns: [parseInt($("#id1").val())]}, {name: $("#name2").val(), treatment_percentage: audience, campaigns: [parseInt($("#id2").val())]});
    }

    if ($("#name3").val() !== "" && $("#id3").val() !== "") {
      if ($("#type_dropdown").val() === "adsets") {
        cells_obj.push({name: $("#name3").val(), treatment_percentage: audience, adsets: [parseInt($("#id3").val())]});
      } else {
        cells_obj.push({name: $("#name3").val(), treatment_percentage: audience, campaigns: [parseInt($("#id3").val())]});
      }
    }

    if ($("#name4").val() !== "" && $("#id4").val() !== "") {
      if ($("#type_dropdown").val() === "adsets") {
        cells_obj.push({name: $("#name4").val(), treatment_percentage: audience, adsets: [parseInt($("#id4").val())]});
      } else {
        cells_obj.push({name: $("#name4").val(), treatment_percentage: audience, campaigns: [parseInt($("#id4").val())]});
      }
    }

    // ACCESS_TOKEN logic

    var fb_access_token = "";
    if (parseInt($("#country_dropdown").val()) === 6) {
      fb_access_token = "EAADeZBgSHnjsBAJi4JGHWUpFeA13bm2SjvOfDL1llxouZB4TSJPZBLZAw2TIgFZA9pbDAuEfD4dsysKiPHcSOkDy1n5ZBAmZC7Fo6I3q65PJYFkHX0h8O2cBFot6jFjD0PCZBzYMMs2aGriUv551kvlaV1Mvltmd7ZC8NJNBjnZA1xkwZDZD";
    } else {
      fb_access_token = "EAADeZBgSHnjsBAJi4JGHWUpFeA13bm2SjvOfDL1llxouZB4TSJPZBLZAw2TIgFZA9pbDAuEfD4dsysKiPHcSOkDy1n5ZBAmZC7Fo6I3q65PJYFkHX0h8O2cBFot6jFjD0PCZBzYMMs2aGriUv551kvlaV1Mvltmd7ZC8NJNBjnZA1xkwZDZD";
    }

    var processedData = {"name": $("#name").val(), "description": $("#description").val(), "start_time": startDate, "end_time": endDate, "type": "SPLIT_TEST", "cells": cells_obj, "access_token": fb_access_token};
    submitTest(processedData);
  }

  // update to Google Sheets if it is a valid Ad Study
  function updateGoogleSheet(ad_study_id) {
    var all_sheets = ['1yahQgPlrwcTgb5uADyTIt6Ahyzsrks7vPDSzTtF8BoY', '1R8GFHVlpQYVsyZonAPPkjlb-s9j-yoz1-443Rkh1VvQ', '1rG0arZhW_JczujYYNfhol1TzvswLjrNDcAbAGbhROVo', '1RlPLjb6dDylD5HPpMa_iOdTI6bD_xgzumg_LY5BrR-g', '1rPmLfwj4yjcuBuiWKADyGdjYaaUypQUbWZojcnF6xoc', '1L-TLXeCOfuwZbGaIPrPVpu8crYuc3OsAPuK-t6nj0M4', '1NO9W4oo6g6tGHUWd3QQuXrp07cYNklDmVW4S92pgbW8'];
    var country_id = parseInt($("#country_dropdown").val());
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: all_sheets[country_id],
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      values: [ [$("#name").val(), $("#description").val(), $("#startdate").val(), $("#enddate").val(), $("#type_dropdown").val(), $("#name1").val(), $("#id1").val(), $("#name2").val(), $("#id2").val(), $("#name3").val(), $("#id3").val(), $("#name4").val(), $("#id4").val(), ad_study_id] ]
    }).then(function(success) {
      console.log("updated in Google Sheets");
    }, function(error) {
      console.log(error.result.error.message);
    });
  }

  function submitTest(formData) {
    // BIZ_MANAGER_ID logic

    var fb_biz_id = "";
    if (parseInt($("#country_dropdown").val()) === 6) {
      fb_biz_id = "1850079605211859";
    } else {
      fb_biz_id = "683259405096319";
    }

    $.ajax({
      url: "https://graph.facebook.com/v2.8/" + fb_biz_id + "/ad_studies",
      type: 'POST',
      dataType: 'json',
      data: formData,
      success: function(response) {
        $(".errorResponse").hide();
        $(".successResponse").show();

        var successMsg = document.getElementById("success-msg");
        successMsg.innerHTML = "Congratulations! You have scheduled an AB Test on Facebook.<br />This is your Ad Study ID: " + response.id;
        updateGoogleSheet(response.id);
      },
      error: function(xhr, status, error) {
        console.log(JSON.stringify(xhr.responseJSON));

        $(".successResponse").hide();
        $(".errorResponse").show();

        var errorMsg = document.getElementById("error-msg");
        errorMsg.innerHTML = "Sorry, I am unable to schedule an AB Test.<br />This is the error message: " + JSON.stringify(xhr.responseJSON.error.message);
      }
    });

    $('html,body').animate({ scrollTop: 0 }, 'slow');
  }
});
