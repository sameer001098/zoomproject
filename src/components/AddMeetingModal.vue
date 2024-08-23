<template>
    <div class="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div class="relative p-8 bg-white w-full max-w-3xl m-auto flex-col flex rounded-lg">
        <span @click="$emit('close')" class="absolute top-0 right-0 p-4 cursor-pointer">x</span>
        <h2 class="text-xl font-semibold mb-4">Add New Meeting</h2>
        <form @submit.prevent="submitForm" class="grid grid-cols-10 gap-4">
          <div class="col-span-7">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Meeting Title:</label>
              <input v-model="meetingTitle" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter meeting title">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Start Time:</label>
              <input v-model="startTime" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="datetime-local">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Duration (minutes):</label>
              <input v-model="duration" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Enter duration in minutes">
            </div>
          </div>
          <div class="col-span-3 border border-gray">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Attendees:</label>
              <div>
                <label class="inline-flex items-center mt-3">
                  <input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600" v-model="attendees" value="sameershahid5512@gmail.com">
                  <span class="ml-2 text-gray-700">sameershahid5512@gmail.com</span>
                </label>
                <label class="inline-flex items-center mt-3">
                  <input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600" v-model="attendees" value="ahmadaziz764@gmail.com">
                  <span class="ml-2 text-gray-700">ahmadaziz764@gmail.com</span>
                </label>
               
              </div>
            </div>
          </div>
          <div class="col-span-10 flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Add Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        meetingTitle: '',
        startTime: '',
        duration: '',
        attendees: []
      };
    },
    methods: {
      async submitForm() {
        const newMeeting = {
          topic: this.meetingTitle,
          start_time: this.startTime,
          duration: this.duration,
          attendees: this.attendees
        };
  
        try {
          const response = await axios.post('http://localhost:3000/api/meetings', newMeeting);
          const meetingData = response.data;
          
          // Send invitations
          try {
            await axios.post('http://localhost:3000/send-invites', {
              attendees: this.attendees,
              join_url: meetingData.join_url
            });
  
            console.log('Invitations sent successfully');
          } catch (error) {
            console.error('Error sending invitations:', error);
          }
  
          this.$emit('add-meeting', meetingData);
          this.$emit('close');
        } catch (error) {
          console.error('Error adding meeting:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .bg-smoke-light {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .max-w-3xl {
      max-width: 60rem;
  }
  </style>
  