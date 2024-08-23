<template>
    <div class="flex bg-gray-100 flex-col items-center">
      <div class="flex items-center bg-gray-200 py-1 px-4 mb-4 mt-8 w-full max-w-6xl justify-between">
        <h2 class="text-xl font-semibold">My Zoom Meetings</h2>
        <button @click="showModal = true" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          +Add
        </button>
      </div>
  
      <div class="w-full max-w-6xl mx-32">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr class="bg-gray-100">
              <th class="border px-4 py-2">Id</th>
              <th class="border px-4 py-2">Meeting title</th>
              <th class="border px-4 py-2">Start Time</th>
              <th class="border px-4 py-2">Duration</th>
              <th class="border px-4 py-2">Created by</th>
              <th class="border px-4 py-2">Url</th>
              <th class="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="meeting in meetings" :key="meeting.id">
              <td class="border px-4 py-2">{{ meeting.id }}</td>
              <td class="border px-4 py-2">{{ meeting.topic }}</td>
              <td class="border px-4 py-2">{{ meeting.start_time }}</td>
              <td class="border px-4 py-2">{{ meeting.duration }}</td>
              <td class="border px-4 py-2">{{ meeting.host_id }}</td>
              <td class="border px-4 py-2">
                <a :href="meeting.join_url" target="_blank">Join Meeting</a>
              </td>
              <td class="border px-4 py-2">
                <button @click="startMeeting(meeting)" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"> 
                  Start
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <AddMeetingModal v-if="showModal" @close="showModal = false" @add-meeting="addMeeting" />
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import AddMeetingModal from './AddMeetingModal.vue';
  
  const meetings = ref([]);
  const showModal = ref(false);
  
  
  const emit = defineEmits(['start-meeting']);

  const getToken = () => {
  window.open('http://localhost:3000/api/zoom-auth', '_blank');
};
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/meetings'); 
      meetings.value = response.data.meetings;
      console.log(response);
      
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }

    getToken(); 
  });


  const addMeeting = (newMeeting) => {
    meetings.value.push(newMeeting);
  };
  

  const startMeeting = (meeting) => {
    const meetingData = {
      meetingNumber: meeting.id,
      passWord: meeting.password || 'Le1ydY', // Use dynamic password if available
    };
    emit('start-meeting', meetingData);
  };
  </script>
  
  <style>
  table {
    border-collapse: collapse;
    width: 100%;
    table-layout: auto !important;
    word-wrap: break-word;
  }
  
  td {
    padding: 24px;
    text-align: center;
    border-bottom: 1px solid rgb(224, 242, 237);
  }
  
  .header-item {
    padding: 30px 20px;
    font-size: 12px;
    background-color: rgb(7, 190, 138);
    text-transform: uppercase;
  }
  
  .table-rows:nth-child(odd) {
    background-color: rgb(250, 250, 250);
  }
  
  .table-rows:nth-child(n):hover {
    background-color: rgb(244, 246, 245);
  }
  </style>
  
 