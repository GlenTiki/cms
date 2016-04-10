import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
var templateBuilder = require('./templateBuilder')
var createOverviewSection = templateBuilder.createOverviewSection
var createOfferingSection = templateBuilder.createOfferingSection

export class EventEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      event: this.props.event
    }
  }

  componentWillReceiveProps(next) {
    this.setState({event: next.event})
  }

  getValue () {
    return this.state.event
  }

  handleNameChange (e) {
    var value = e.target.value
    var next = this.state.event
    next.name = value
    next.nameLowercase = value.toLowerCase()
    next.overview.data[0].text = value
    this.setState({event: next})
  }

  handleSubtitleChange (e) {
    var value = e.target.value
    var next = this.state.event
    next.overview.data[1].text = value
    this.setState({event: next})
  }

  addOverviewSection () {
    var event = this.state.event
    event.overview.data.push(createOverviewSection(event.overview.data.length))
    this.setState({event: event})
  }

  deleteOverviewSection () {
    var event = this.state.event
    if (event.overview.data.length > 2)
      event.overview.data.pop()
    this.setState({event: event})
  }

  handleOverviewMetaChange (e) {
    var next = this.state.event.overview.meta
    next.css = this.refs['overviewMetaCss'].value
    next.style = this.refs['overviewMetaCss'].value
    var event = this.state.event
    event.overview.meta = next
    this.setState({event: event})
  }

  addOffering () {
    var event = this.state.event
    event.offerings.data.push(createOfferingSection(event.offerings.data.length))
    this.setState({event: event})
  }

  deleteOffering () {
    var event = this.state.event
    event.offerings.data.pop()
    this.setState({event: event})
  }

  render () {
    var that = this
    var event = this.state.event

    var titleEditor = (
      <label>
        Title
        <input
          type="text"
          value={event.name}
          onChange={this.handleNameChange.bind(this)}
          />
      </label>
    )

    var subtitleEditor = (
      <label>
        SubTitle
        <input
          type="text"
          value={event.overview.data[1].text}
          onChange={this.handleSubtitleChange.bind(this)}
          />
      </label>
    )

    var TemplateEditor = function () {
      var textChanged = function(){
        var next = event
        next.period = that.refs['period'].value
        next.template_meta.panel_hover_css = that.refs['template_meta_panel_hover_css'].value
        next.template_meta.submission_container_css = that.refs['template_meta_submission_container_css'].value
        next.template_meta.attendee_edit_hover_css = that.refs['template_meta_attendee_edit_hover_css'].value
        next.template_meta.description = that.refs['template_meta_description'].value

        that.setState({event: next})
      }

      var changedType = function (e) {
        var next = event
        next.model_type = e.target.value
        next.template_meta.type = 'template1_'+(e.target.value.toLowerCase()=='workshop'?'workshops':'seminar')
        that.setState({event: next})
      }
      return (
        <div>
          <div className="input-group">
            <span className="input-group-label">
              Model Type
            </span>
            <select value={event.model_type} onChange={changedType} className="input-group-field">
              <option value='Seminar'>Seminar</option>
              <option value='Workshop'>Workshop</option>
            </select>
          </div>
          <label>
            Period
          </label>
          <input
            ref="period"
            type="text"
            placeholder="period"
            value={event.period}
            onChange={textChanged}
          />
          <label>
            template_meta panel_hover_css
          </label>
          <input
            ref="template_meta_panel_hover_css"
            type="text"
            placeholder="template_meta panel_hover_css"
            value={event.template_meta.panel_hover_css}
            onChange={textChanged}
          />
          <label>
            template_meta submission_container_css
          </label>
          <input
            ref="template_meta_submission_container_css"
            type="text"
            placeholder="template_meta submission_container_css"
            value={event.template_meta.submission_container_css}
            onChange={textChanged}
          />
          <label>
            template_meta attendee_edit_hover_css
          </label>
          <input
            ref="template_meta_attendee_edit_hover_css"
            type="text"
            placeholder="template_meta attendee_edit_hover_css"
            value={event.template_meta.attendee_edit_hover_css}
            onChange={textChanged}
          />
          <label>
            template_meta description
          </label>
          <input
            ref="template_meta_description"
            type="text"
            placeholder="template_meta description"
            value={event.template_meta.description}
            onChange={textChanged}
          />
        </div>
      )
    }
    var templateEditor = TemplateEditor()

    // MARK: overview meta element
    var overviewMeta = event.overview.meta
    var overviewMetaEditor = (
      <div>
        <label>
          Meta
        </label>
        <input
          ref="overviewMetaCss"
          type="text"
          placeholder="css"
          value={overviewMeta.css}
          onChange={this.handleOverviewMetaChange.bind(this)}
          />
        <input
          ref="overviewMetaStyle"
          type="text"
          value={overviewMeta.style}
          placeholder="style"
          onChange={this.handleOverviewMetaChange.bind(this)}
          />
        </div>
    )

    // MARK: overview items elements
    var overviewItems = event.overview.data.slice()
    overviewItems.splice(0, 2)

    var overviewNodes = (<h4>Nothing to see here. Click the + above to add more overview sections.</h4>)
    if (overviewItems.length > 0) {
      overviewNodes = overviewItems.map(function (n, i) {
        var handleOverviewTextChange = function (e) {
          var next = n
          next.key = that.refs['onkey'+i].value
          next.value = that.refs['onvalue'+i].value
          next.text = `<span style='font-size:2em'>${next.key}:</span> ${next.value}`
          next.css = that.refs['oncss'+i].value
          next.style = that.refs['onstyle'+i].value
          var event = that.state.event
          event.overview.data[i+2] = next
          that.setState({event: event})
        }

        if(!n.key || !n.value) {
          var parser = new DOMParser()
          var htmlDoc=parser.parseFromString(n.text, "text/html")
          var span = htmlDoc.querySelector('span')
          var body = htmlDoc.querySelector('body').innerHTML
          var key = span.innerHTML.replace(':', '')
          var value = body.replace(span.outerHTML, '')
          n.key = key
          n.value = value
        }

        return (
          <div key={i} className="callout">
            <input
              ref={'onkey'+i}
              type="text"
              value={n.key}
              onChange={handleOverviewTextChange}
              placeholder="Label"
              />

            <input
              ref={'onvalue'+i}
              type="text"
              value={n.value}
              onChange={handleOverviewTextChange}
              placeholder="details"
              />

            <input
              ref={'oncss'+i}
              type="text"
              value={n.css}
              onChange={handleOverviewTextChange}
              placeholder="css"
              />

            <input
              ref={'onstyle'+i}
              type="text"
              value={n.style}
              onChange={handleOverviewTextChange}
              placeholder="style"
              />
          </div>
        )
      })
    }

    // MARK: Offerings meta element
    var offeringMeta = event.offerings.meta
    var OfferingMetaNode = function () {
      var changedColumns = function (e) {
        var event = that.state.event
        event.offerings.meta.columns = e.target.value
        that.setState({event: event})
      }

      var handleTextChange = function(){
        var event = that.state.event
        event.offerings.meta.columnCss = that.refs['ofcolumncss'].value
        event.offerings.meta.columnStyle = that.refs['ofcolumnstyle'].value
        event.offerings.meta.itemCss = that.refs['ofitemcss'].value
        event.offerings.meta.itemStyle = that.refs['ofitemstyle'].value
        that.setState({event: event})
      }

      var handleActiveChange = function(e){
        var event = that.state.event
        event.offerings.meta.visible = !offeringMeta.visible
        that.setState({event: event})
      }

      return (
        <div>
          <div className="input-group">
            <span className="input-group-label">
              Columns:
            </span>
            <select value={offeringMeta.columns} onChange={changedColumns} className="input-group-field">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          <label>Column Css</label>
          <input
            ref={'ofcolumncss'}
            type="text"
            value={offeringMeta.columnCss}
            onChange={handleTextChange}
            placeholder="Column Css"
          />
          <label>Column Style</label>
          <input
            ref={'ofcolumnstyle'}
            type="text"
            value={offeringMeta.columnStyle}
            onChange={handleTextChange}
            placeholder="Column Style"
          />
        <label>Item Css</label>
          <input
            ref={'ofitemcss'}
            type="text"
            value={offeringMeta.itemCss}
            onChange={handleTextChange}
            placeholder="Item Css"
          />
        <label>Item Style</label>
          <input
            ref={'ofitemstyle'}
            type="text"
            value={offeringMeta.itemStyle}
            onChange={handleTextChange}
            placeholder="Item Style"
          />
        </div>
      )
    }
    var offeringMetaNode = OfferingMetaNode()

    var offeringsItems = event.offerings.data
    var offeringsNodes = (<h4>Nothing to see here!</h4>)

    if(offeringsItems.length > 0) {
      offeringsNodes = offeringsItems.map(function(offering, i) {
        var handleDateChange = function (date) {
          event.offerings.data[i].lines[0].text = date.format("dddd Do MMMM YYYY")
          that.setState({event: event})
        }

        var handleTextChange = function () {
          var next = offering
          next.lines[0].css = that.refs['ofcss'+i].value
          next.lines[0].style = that.refs['ofstyle'+i].value
          next.lines[1].style = that.refs['ofsubtitle'+i].value
          next.lines[1].style = that.refs['ofsubtitlecss'+i].value
          next.lines[1].style = that.refs['ofsubtitlestyle'+i].value
          event.offerings.data[i].lines[0] = next
          that.setState({event: event})
        }

        return (<div key={i} className="callout">
          <h5>Offering {i}</h5>
          Display title: {offering.lines[0].text}
          <DatePicker
            selected={moment(offering.lines[0].text, "dddd Do MMMM YYYY")}
            onChange={handleDateChange}
            locale="en-ie"
          />
          <label>Title css</label>
          <input
            ref={'ofcss'+i}
            type="text"
            value={offering.lines[0].css}
            onChange={handleTextChange}
            placeholder="css"
          />
          <label>Title style</label>
          <input
            ref={'ofstyle'+i}
            type="text"
            value={offering.lines[0].style}
            onChange={handleTextChange}
            placeholder="style"
          />
          <label>Subtitle</label>
          <input
            ref={'ofsubtitle'+i}
            type="text"
            value={offering.lines[1].text}
            onChange={handleTextChange}
            placeholder="css"
          />
          <label>Subtitle css</label>
          <input
            ref={'ofsubtitlecss'+i}
            type="text"
            value={offering.lines[1].css}
            onChange={handleTextChange}
            placeholder="css"
          />
        <label>Subtitle style</label>
          <input
            ref={'ofsubtitlestyle'+i}
            type="text"
            value={offering.lines[1].style}
            onChange={handleTextChange}
            placeholder="style"
          />
        </div>)
      })
    }

    var offeringsSection = (
      <div>
        {offeringMetaNode}
        <div className="row">
          <button type="button" className="success button" style={{float:'right'}} onClick={ this.addOffering.bind(this) } > + </button>
          <button type="button" className="alert button" style={{float:'right'}} onClick={ this.deleteOffering.bind(this) } > - </button>
        <h3 style={{float:'right'}}>Modify Offerings:</h3>
      </div>
      {offeringsNodes}
    </div>
    )

    var organisation = event.organisation

    var OrganisationSection = function () {
      var handleTextChange = function () {
        var event = that.state.event
        event.organisation.meta['ui_text_to_display'] = that.refs['orgtype'].value
        event.organisation.meta['addressfilterfield'] = that.refs['addressfilterfield'].value
        event.organisation.meta['sectorNo_text'] = that.refs['sectorNo_text'].value
        event.organisation.data['orgId'] = that.refs['orgId'].value
        event.organisation['orgId'] = that.refs['orgId'].value
        event.organisation.data['name'] = that.refs['name'].value
        event.organisation['name'] = that.refs['name'].value
        event.organisation.data['email'] = that.refs['email'].value
        event.organisation['email'] = that.refs['email'].value
        event.organisation.data['email2'] = that.refs['email2'].value
        event.organisation['email2'] = that.refs['email2'].value
        event.organisation.data['address'] = that.refs['address'].value
        event.organisation['address'] = that.refs['address'].value
        event.organisation.data['County'] = that.refs['County'].value
        event.organisation['County'] = that.refs['County'].value

        that.setState({event: event})
      }

      var handleActiveChange = function(e){
        var event = that.state.event
        event.organisation.meta.enabled = !organisation.meta.enabled
        that.setState({event: event})
      }

      var changedTemplate = function (e) {
        var next = event
        console.log(e.target.value)
        next.organisation.meta.template = e.target.value
        that.setState({event: next})
      }

      return (
        <div>
          <input
            type="checkbox"
            checked={organisation.meta.enabled}
            onChange={handleActiveChange}
          />
        <label>Enabled</label><br/>
          <div className="input-group">
            <span className="input-group-label">
              Template Type
            </span>
            <select value={organisation.meta.template} onChange={changedTemplate} className="input-group-field">
              <option value='organisation_minimum'>minimum</option>
              <option value='organisation_maximum'>maximum</option>
            </select>
          </div>
          <label>Organisation type</label>
            <input
              ref={'orgtype'}
              type="text"
              value={organisation.meta['ui_text_to_display']}
              onChange={handleTextChange}
              placeholder="Organisation type"
            />
          <label>address filter field</label>
            <input
              ref={'addressfilterfield'}
              type="text"
              value={organisation.meta['addressfilterfield']}
              onChange={handleTextChange}
              placeholder="addressfilterfield"
            />
          <label>Sector No Text</label>
            <input
              ref={'sectorNo_text'}
              type="text"
              value={organisation.meta['sectorNo_text']}
              onChange={handleTextChange}
              placeholder="sectorNo_text"
            />
          <label>orgId</label>
            <input
              ref={'orgId'}
              type="text"
              value={organisation.data['orgId']}
              onChange={handleTextChange}
              placeholder="orgId"
            />
          <label>name</label>
            <input
              ref={'name'}
              type="text"
              value={organisation.data['name']}
              onChange={handleTextChange}
              placeholder="name"
            />
          <label>email</label>
            <input
              ref={'email'}
              type="text"
              value={organisation.data['email']}
              onChange={handleTextChange}
              placeholder="email"
            />
          <label>email confirmation</label>
            <input
              ref={'email2'}
              type="text"
              value={organisation.data['email2']}
              onChange={handleTextChange}
              placeholder="email2"
            />
            <label>address</label>
            <input
              ref={'address'}
              type="text"
              value={organisation.data['address']}
              onChange={handleTextChange}
              placeholder="address"
            />
            <label>County</label>
            <input
              ref={'County'}
              type="text"
              value={organisation.data['County']}
              onChange={handleTextChange}
              placeholder="County"
            />

        </div>
      )
    }
    var organisationSection = OrganisationSection()

    var contact = event.contact

    var ContactSection = function () {
      var handleTextChange = function () {
        var event = that.state.event
        event.contact.data['surname'] = that.refs['contactsurname'].value
        event.contact.data['forename'] = that.refs['contactforename'].value
        event.contact.data['position'] = that.refs['contactposition'].value
        event.contact.data['email'] = that.refs['contactemail'].value
        event.contact.data['email2'] = that.refs['contactemail2'].value
        event.contact.data['phone'] = that.refs['contactphone'].value

        that.setState({event: event})
      }

      var handleActiveChange = function(e){
        var event = that.state.event
        event.contact.meta.enabled = !contact.meta.enabled
        that.setState({event: event})
      }

      return (
        <div>
          <input
            type="checkbox"
            checked={contact.meta.enabled}
            onChange={handleActiveChange}
          />
        <label>Enabled</label><br/>
          <label>surname</label>
            <input
              ref={'contactsurname'}
              type="text"
              value={contact.data['surname']}
              onChange={handleTextChange}
              placeholder="surname"
            />
          <label>forename</label>
            <input
              ref={'contactforename'}
              type="text"
              value={contact.data['forename']}
              onChange={handleTextChange}
              placeholder="forename"
            />
          <label>position</label>
            <input
              ref={'contactposition'}
              type="text"
              value={contact.data['position']}
              onChange={handleTextChange}
              placeholder="position"
            />
          <label>email</label>
            <input
              ref={'contactemail'}
              type="text"
              value={contact.data['email']}
              onChange={handleTextChange}
              placeholder="email"
            />
          <label>email2</label>
            <input
              ref={'contactemail2'}
              type="text"
              value={contact.data['email2']}
              onChange={handleTextChange}
              placeholder="email2"
            />
          <label>phone</label>
            <input
              ref={'contactphone'}
              type="text"
              value={contact.data['phone']}
              onChange={handleTextChange}
              placeholder="phone"
            />
        </div>
      )
    }
    var contactSection = ContactSection()

    var AttendeesSection = function() {
      return (
        <div>ha</div>
      )
    }
    var attendeesSection = AttendeesSection()

    return (
      <div>
        <div className="callout">
          <h2 className=""> Event Editor </h2>
          <div className="callout">
            {titleEditor}
            {subtitleEditor}
            {templateEditor}
            {overviewMetaEditor}
          </div>
          <div className="row">
            {/*Now, allow variable numbers of fields...*/}
            <button type="button" className="success button" style={{float:'right'}} onClick={ this.addOverviewSection.bind(this) } > + </button>
            <button type="button" className="alert button" style={{float:'right'}} onClick={ this.deleteOverviewSection.bind(this) } > - </button>
            <h3 style={{float:'right'}}>Modify Overview Details:</h3>
          </div>
          { overviewNodes }
        </div>
        <div className="callout">
          <h2>
            Offerings section
          </h2>
          { offeringsSection }
        </div>
        <div className="callout">
          <h2>
            Organisation section
          </h2>
          { organisationSection }
        </div>
        <div className="callout">
          <h2>
            Contact section
          </h2>
          { contactSection }
        </div>
        <div className="callout">
          <h2>
            attendees section
          </h2>
          { attendeesSection }
        </div>
      </div>
    )
  }
}
