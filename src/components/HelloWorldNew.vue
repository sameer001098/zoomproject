<script setup>
import { ref } from 'vue';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

const client = ZoomMtgEmbedded.createClient();
const authEndpoint = 'http://localhost:4000/';
const sdkKey = 'URMcC59tSxCFRhEwocOQIw';
const role = 1;
const userName = 'Zeeshan Shahid';
const userEmail = 'sameershahid7032@gmail.com';
const registrantToken = '';
const zakToken = '';

const meetingNumber = ref('');
const passWord = ref('');

function getSignature() {
  fetch(authEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meetingNumber: meetingNumber.value,
      role: role
    })
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    startMeeting(data.signature);
  }).catch((error) => {
    console.log(error);
  });
}

function startMeeting(signature) {
  let meetingSDKElement = document.getElementById('meetingSDKElement');

  client.init({
    zoomAppRoot: meetingSDKElement,
    language: 'en-US',
    patchJsMedia: true,
    leaveOnPageUnload: true
  }).then(() => {
    client.join({
      signature: signature,
      sdkKey: sdkKey,
      meetingNumber: meetingNumber.value,
      password: passWord.value,
      userName: userName,
      userEmail: userEmail,
      tk: registrantToken,
      zak: zakToken
    }).then(() => {
      console.log('joined successfully');
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
}

// Function to receive meeting data
function startZoomMeeting(meetingData) {
  meetingNumber.value = meetingData.meetingNumber;
  passWord.value = meetingData.passWord;
  getSignature();
}

defineExpose({ startZoomMeeting });
</script>

<template>
  <!-- <h1>Zoom Meeting SDK Vue.js Sample</h1> -->
  <div id="meetingSDKElement">
    <!-- Zoom Meeting SDK Component View Rendered Here -->
  </div>
</template>

<style scoped>
</style>

