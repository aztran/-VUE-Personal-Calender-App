<template>
  <div id="app">

    <h1 class="title">Personal Calender Web App</h1>
    <transition name="fade">
       <div class="form" v-if="form">
        <a href="#" class="btn--exit" @click="closeForm">x</a>
        <h3>Add Event {{date}}</h3>
          <div class="form-group">
            <label for="name">Title</label>
            <input type="hidden" :value="date" >
            <input type="text" required v-model="event.title" name="name" id="name">
          </div>
          <div class="form-group">
            <label for="time">Time</label>
            <input type="time" required v-model="event.time" name="time" id="time">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" required v-model="event.email" name="email" id="email">
          </div>
          <button
            class="btn btn-success"
            @click="addEvent"
          > Add Event
          </button>

      </div>
    </transition>
    <button v-if="selected.forRemove"  @click="removeEvent">Remove</button>
    <pre v-if="selected.forRemove">Remove {{ selected.forRemove }} (currently remove locally)</pre>
    <full-calendar :events="events"
      defaultView="month"
      @event-selected="eventSelected"
      @event-created="eventCreated"
      @event-render="eventRender"
      @day-click="dayClick"
      @event-afer-render="eventAfterRender"

      ref="calendar"
      :config="config"
    >
    </full-calendar>

    <div class="footer">&nbsp;</div>
  </div>
</template>

<script>
// import kalender from '@/components/Calender.vue'
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
export default {
  name: 'app',
  components: {
    FullCalendar
  },
  data() {
    return {
      config: {
        eventLimit: 3,
        eventStartEditable: false,
        header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month'
          },
        eventClick: (event) => {
          this.selected = event;
          alert(this.selected.description);
          console.log(this.selected._id);
        },
      },
      selected: {},
      form: false,
      date: '',
      color: '#000000',
      event: {
        title: '',
        time: '',
        email: '',
        start: '',
      },
      events: [],
    };
  },
  methods: {
    closeForm() {
      this.form = false;
      this.selected={};
    },
    // eventSelected(event, jsEvent){
    //   // alert("email " + event.description);
    //   this.$refs.calendar.$emit('remove-events', event);
    // },

    eventSelected(event) {
      // this.selected = event;
      //  console.log(this.selected);
    },

    eventCreated(...test) {
      console.log(test);
    },

    eventAfterRender(event, element, view) {
      // alert('halo' +view);
    },
    eventCreated(event) {
      this.form=true;
    },

    eventRender (event, element) {
      var b= `<a href="#" class="removebtn" @click="removeX">X</a>`;
      element.append( b);
    },
    dayClick(date, jsEvent, view) {
      this.date = date.format();
    },
    removeEvent() {
      //remove locally
      this.$refs.calendar.$emit('remove-event', this.selected._id);
      //remove database (not working)
      // this.selected = {};
      //   this.$http.delete('https://vuejs-60074.firebaseio.com/data.json', { params: { title: this.selected._id } }).then(res => {
      //   // this.refresh();
      //   console.log(res.data);

      //   });
    },
    addEvent() {
      //generate random color
      this.color = '#'+(Math.random() *0xFFFFFF<<0).toString(16);
      //events to store to firebase
      const eventss= {
        title: this.event.time + " " + this.event.title,
        description: this.event.email,
        forRemove: this.event.title,
        start: this.date,
        color: this.color,
      };
      //validate first
      if (this.event.title === "") {
        alert('Title must be filled');
        return;
      }
      else if (this.event.time === "") {
        alert('time must be filled');
        return;
      }
      if (this.event.color === "#ffffff") {
        alert('color must be filled');
        return;
      }
      //store data using https vue resource
      this.$http.post('https://vuejs-60074.firebaseio.com/data.json', eventss)
        .then(response =>{
          alert('data saved');
          //get data from firebase
          this.$http.get('https://vuejs-60074.firebaseio.com/data.json')
          .then(response=> {
            return response.json()
            console.log(response.key);
          })
          .then(data=> {
            const resultArray =  [];
              for (let key in data){
                  resultArray.push(data[key]);
              }
              this.events = resultArray;
              console.log(resultArray);
          })
        },
        error =>{
          console.log(error);
      });
    },
  },
  created() {
    this.$http.get('https://vuejs-60074.firebaseio.com/data.json')
    .then(response=> {
      return response.json()
    })
    .then(data=> {
      const resultArray =  [];
      for (let key in data){
        resultArray.push(data[key]);
      }
      this.events = resultArray;
        console.log(resultArray);
    });
  },
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

.title {
  // border-bottom: 1px solid black;
  padding:30px 0;
  margin-bottom: 16px;
  background-color: #ff3f63;
  color: #fff;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.removebtn {
  color:black;
  position: absolute;
  top: 0;
  right: 0;
  width:13px;
  height: 13px;
  text-align:center;
  border-radius:50%;
  font-size: 10px;
  cursor: pointer;
  background-color: #FFF
}
.form {
  width: 50%;
  margin: 0 auto;
  position: relative;


  &-group {
    display: flex;
    justify-content: space-between;
    margin:2px 0;

    label {
      font-weight: bold;
    }

    input {
      width: 80%;
      padding: 2px;
      font-size: 16px;
      border-radius: 4px;
    }

  }
    .btn {
      width: 20%;
      font-size: 16px;
      color: white;
      margin-top: 20px;
      margin-bottom: 40px;
      background-color: #5a88ca;
      // width: 80%;
      right: 0;
      cursor: pointer;
      text-align: center;
      border-radius: 4px;

      &--exit {
        position: absolute;
        background: white;
        text-decoration: none;
        font-size: 20px;
        width: 30px;
        height: 30px;
        top: -10px;
        right: -10px;
        border-radius: 50%;
        border:1px solid black;
        transition: all .5s;

        &:hover {
          background: #5a88ca;
          border-color: transparent;
          color: white;
        }
      }
    }
}

.footer {
  padding:30px 0;
  margin-bottom: 16px;
  background-color: #ff3f63;
  color: #fff;
}

</style>
