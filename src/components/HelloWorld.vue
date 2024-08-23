<script setup>
import { ZoomMtg } from '@zoom/meetingsdk';
import _ from 'lodash';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

var authEndpoint = 'http://localhost:4000/';
var sdkKey = 'URMcC59tSxCFRhEwocOQIw';
var meetingNumber = '73995651073';
var passWord = '1234';
var role = 1;
var userName = 'Zeeshan Shahid';
var userEmail = 'sameershahid7032@gmail.com';
var registrantToken = '';
var zakToken = '';
var leaveUrl = 'http://localhost:5173/';

function getSignature() {
  fetch(authEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meetingNumber: meetingNumber,
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
  document.getElementById('zmmtg-root').style.display = 'block';

  ZoomMtg.init({
    leaveUrl: leaveUrl,
    patchJsMedia: true,
    leaveOnPageUnload: true,
    success: (success) => {
      console.log(success);
      ZoomMtg.join({
        signature: signature,
        sdkKey: sdkKey,
        meetingNumber: meetingNumber,
        passWord: passWord,
        userName: userName,
        userEmail: userEmail,
        tk: registrantToken,
        zak: zakToken,
        success: (success) => {
          console.log(success);
        },
        error: (error) => {
          console.log(error);
        }
      });
    },
    error: (error) => {
      console.log(error);
    }
  });
}
</script>

<template>
  <h1>Zoom Meeting SDK Vue.js Sample</h1>

  <button @click='getSignature'>Join Meeting</button>





</template>

<style scoped>

</style>
