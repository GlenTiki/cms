module.exports.createEvent = function(id) {
  var title = "Seminar " + id
  var subtitle = "Booking Form for " + title
  return {
    "id":id,
    "cId":"xyz"+id,
    "name": title,
    "nameLowercase" : title.toLowerCase(),
    "model_type": "Seminar",
    "template_meta": {
      "copiedFrom":"",
      "type":"template1_seminar",
      "panel_hover_css" : "rl_hover_straw",
      "submission_container_css" : "rl_rcorners15 rl_brd_clr_green rl_brd_solid rl_box_shadow1",
      "attendee_edit_hover_css" : "rl_hover_lime",
      "description":"Seminar: 1:N,i.e. One offering, 1+ attendees, used when offering is full session/day and no second or more offerings for the attendee"
    },
    "period":"2016",
    "available":true,
    "active":true,
    "active_start":"01/01/2016",
    "active_finish":"31/12/2016",
    "notes": "_",
    "contact":{
      "meta":{
        "enabled":false
      },
      "data":{
        "surname":"",
        "forename":"",
        "position":"",
        "email":"",
        "email2":"",
        "phone":""
      }
    },
    "organisation": {
      "meta":{
        "enabled":true,
        "template":"organisation_minimum",
        "ui_text_attendee":"Delegate",
        "ui_text_to_display":"ZZZZZ",
        "requireContactDetails":true,
        "allowChooser":true,
        "allowCountyFilter":true,
        "addressfilterfield":"County",
        "sectorNo_text":"ZZZZZ No.",
        "visible_also":[
            "visible_address1",
            "address2",
            "address3",
            "postcode",
            "county_region",
            "sectorNo",
            "contact_name",
            "telephone",
            "fax"
        ]
      },
      "data":{
        "orgId":"",
        "name":"",
        "email":"",
        "email2":"",
        "address":"",
        "County":""
      }
    },
    "attendees_meta": {
      "maxNo":10,
      "max_per_entry":-1,
      "request_lunch":false,
      "request_position":true,
      "positions":[{
          "id":1,
          "name":"aaaaaaaaaaaaaa"
        },
        {
          "id":2,
          "name":"bbbbbbbbbbbbb"
        },
        {
          "id":3,
          "name":"ccccccccc"
      }]
    },
    "overview": {
      "meta": {
        "visible":true,
        "css" : "b_solid rl_bkg_color_green rl_rcorners25 ",
        "style" : "font-size:1em"
      },
      "data": [
        {
          "visible":true,
          "text": title,
          "css":"rl_text_color_black    text-center rl_font_2_5  ",
          "style" :"",
          "required": true
        },
        {
          "visible":true,
          "text": subtitle,
          "css":"rl_text_color_black     text-center rl_font_2_0",
          "style" :"",
          "required": true
        },
        {
          "visible":true,
          "text":"<span style='font-size:2em'>Dates: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1st January, 25 December",
          "css":"rl_text_color_black    rl_font_1_0 ",
          "style" :""
        },
        {
          "visible":true,
          "text":"<span style='font-size:2em'>Venues: </span>Nationwide",
          "css":"rl_text_color_black     ",
          "style" :""
        },
        {
          "visible":true,
          "text": "<span style='font-size:2em'>Time: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is a two and a half hour programme - times vary.",
          "css": "rl_text_color_black    rl_font_1_0",
          "style" :""
        }
      ]
    },
    "offerings": {
      "meta": {
        "visible":true,
        "columns":2,
        "columnCss": " b_solid rl_bkg_color_blue1 rl_rcorners25",
        "columnStyle": "padding-bottom:10px;  ",
        "itemCss" : "  rl_rcorners15 rl_brd_clr_black rl_brd_solid rl_box_shadow1 rl_margin_top_10",
        "itemStyle" : "border-width: 3px; rl_font_1_5 rl_padding_left_15"
      },
      "data": [
        {
          "status":"", "date":"", "quota" : -1,
          "order":1,
          "visible":true,
          "tag" : "",
          "lines": [{
              "text":"Monday 25th June 2015",
              "css":"rl_padding_left_15 rl_font_1_5",
              "style":""
            },
            {
              "text":"10am-12.30pm aaaaaaaaaa",
              "css":"rl_padding_left_15 rl_font_1_2",
              "style":""
            }
          ]
        },
        {
          "status":"", "date":"", "quota" : -1,
          "order":2,
          "visible":true,
          "lines":[{
              "text":"Tuesday 26th June 2015",
              "css":"rl_padding_left_15 rl_font_1_5",
              "style":""
            },
            {
              "text":"2pm -4.30pm bbbbb, bbbbb",
              "css":"rl_padding_left_15 rl_font_1_2",
              "style":""
            }
          ]
        }
      ]
    }
  }
}

module.exports.createOverviewSection = function (id) {
  return {
    "id": id,
    "visible": true,
    "key": `section ${id}`,
    "value": `Example text for ${id}`,
    "text":`<span style='font-size:2em'>section ${id}:</span>Example text for ${id}`,
    "css":"rl_text_color_black    rl_font_1_0 ",
    "style" :"",
  }
}
