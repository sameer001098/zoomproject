<script setup>
import { ref } from 'vue';
import './assets/main.css';
import './assets/base.css';
import HelloWorldNew from './components/HelloWorldNew.vue';
import GetMeetings from './components/GetMeetings.vue';

const helloWorldRef = ref(null);

const handleStartMeeting = (meetingData) => {
  if (helloWorldRef.value) {
    helloWorldRef.value.startZoomMeeting(meetingData);
  }
};
</script>

<template>
  <main>
    <HelloWorldNew ref="helloWorldRef" />
    <GetMeetings @start-meeting="handleStartMeeting" />
  </main>
</template>

<style scoped>
</style>


<!-- <script setup>
import HelloWorld from './components/HelloWorldNew.vue';
import meetings from './components/GetMeetings.vue'
</script>

<template>
  <main>
    <HelloWorld />
    <meetings />
  </main>
</template>

<style scoped>

</style> -->
