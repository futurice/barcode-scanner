import QRReader from './vendor/qrscan.js';
import {snackbar} from './snackbar.js';
import styles from '../css/styles.css';
import isURL from 'is-url';

//If service worker is installed, show offline usage notification
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    if (!localStorage.getItem("offline")) {
      localStorage.setItem("offline", true);
      snackbar.show('App is ready for offline usage.', 5000);
    }
  });
}

//To generate sw.js file
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install();
}

window.addEventListener("DOMContentLoaded", () => {
  //To check the device and add iOS support
  window.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;

  ////////////// DEMO JS
  var state = {
    isButton1Toggled: false,
    isButton2Toggled: false,
    displayedImages: false, // there are two cases now - therefore boolean
  }

  var images = {
    case1: {
      image1: 'http://via.placeholder.com/540x715?text=img1',
      image2: 'http://via.placeholder.com/540x715/ffffff/000000?text=img2'
    },
    case2: {
      image1: 'http://via.placeholder.com/540x715?text=img3',
      image2: 'http://via.placeholder.com/540x715/ffffff/000000?text=img4'
    }
  }

  var action1Button = document.querySelector('.action1-js')
  var action2Button = document.querySelector('.action2-js')
  var action1Image = document.querySelector('.image1-js')
  var action2Image = document.querySelector('.image2-js')
  var changeCaseButton = document.querySelector('.change-case-js')
  var overlay = document.querySelector('.app__demo-js')

  // Init
  action1Image.style.display = 'none'
  action2Image.style.display = 'none'
  changeCaseButton.style.display = 'none'
  changeImages()

  function toggleButton1() {
    toggleElement(action1Image)
    state.isButton1Toggled = !state.isButton1Toggled

    if (state.isButton1Toggled && state.isButton2Toggled) {
      toggleButton2()
    }

    toggleImageSwitch()
  }

  function setImages(imageObject) {
    action1Image.src = imageObject.image1
    action2Image.src = imageObject.image2
  }

  function changeImages() {
    if(!state.displayedImages) {
      setImages(images.case1)
      state.displayedImages = !state.displayedImages
    } else {
      setImages(images.case2)
      state.displayedImages = !state.displayedImages
    }
  }

  function toggleImageSwitch() {
    if(state.isButton1Toggled || state.isButton2Toggled) {
      toggleElement(changeCaseButton)
    } else {
      toggleElement(changeCaseButton)
    }
  }

  function toggleButton2() {
    toggleElement(action2Image)
    state.isButton2Toggled = !state.isButton2Toggled

    if (state.isButton1Toggled && state.isButton2Toggled) {
      toggleButton1()
    }

    toggleImageSwitch()
  }

  function toggleElement(element) {
    if (element.style.display === 'none') {
      element.style.display = 'inline'
    } else {
      element.style.display = 'none'
    }
  }

  function toggleButtonsOff() {
    if(state.isButton1Toggled) {
      toggleButton1()
    }
    if(state.isButton2Toggled) {
      toggleButton2()
    }
  }

  action1Button.addEventListener('click', toggleButton1)
  action2Button.addEventListener('click', toggleButton2)
  changeCaseButton.addEventListener('click', function() {
    changeImages()
    toggleButtonsOff()
  })
  overlay.addEventListener('click', function() {
    if(state.isButton1Toggled){
      toggleButton2()
    }
  })

  /////////

  var copiedText = null;
  var frame = null;
  var selectPhotoBtn = document.querySelector('.app__select-photos');
  var dialogElement = document.querySelector('.app__dialog');
  var dialogOverlayElement = document.querySelector('.app__dialog-overlay');
  var dialogOpenBtnElement = document.querySelector('.app__dialog-open');
  var dialogCloseBtnElement = document.querySelector('.app__dialog-close');
  var scanningEle = document.querySelector('.custom-scanner');
  var textBoxEle = document.querySelector('#result');
  var helpText = document.querySelector('.app__help-text');
  var infoSvg = document.querySelector('.app__header-icon svg');
  var videoElement = document.querySelector('video');
  window.appOverlay = document.querySelector('.app__overlay');
    
  //Initializing qr scanner
  window.addEventListener('load', (event) => {
    QRReader.init(); //To initialize QR Scanner
    // Set camera overlay size
    setTimeout(() => { 
      // setCameraOverlay();
      if (!window.iOS) {
        // scan();
      }
    }, 1000);
  });

  function setCameraOverlay() {
    window.appOverlay.style.borderStyle = 'solid';
    helpText.style.display = 'block';
  }
  
  function createFrame() {
    frame = document.createElement('img');
    frame.src = '';
    frame.id = 'frame';
  }
  
  //Dialog close btn event
  // dialogCloseBtnElement.addEventListener('click', hideDialog, false);
  // dialogOpenBtnElement.addEventListener('click', openInBrowser, false);

  //To open result in browser
  function openInBrowser() {
    console.log('Result: ', copiedText);
    window.open(copiedText, '_blank', 'toolbar=0,location=0,menubar=0');
    copiedText = null;
    hideDialog();
  }

  //Scan
  function scan() {
    if (!window.iOS) scanningEle.style.display = 'block';
  }

  //Hide dialog
  function hideDialog() {
    copiedText = null;
    textBoxEle.value = "";

    if (window.iOS) {
      frame.src = "";
      frame.className = "";
    }

    dialogElement.classList.add('app__dialog--hide');
    dialogOverlayElement.classList.add('app__dialog--hide');
    scan();
  }

  // For iOS support
  if (window.iOS) selectFromPhoto();

  function selectFromPhoto() {
    if (videoElement) videoElement.remove(); //removing the video element
    
    //Creating the camera element
    var camera = document.createElement('input');
    camera.setAttribute('type', 'file');
    camera.setAttribute('capture', 'camera');
    camera.id = 'camera';
    helpText.textContent = '';
    helpText.style.color = '#212121';
    helpText.style.bottom = '-60px';
    infoSvg.style.fill = '#212121';
    window.appOverlay.style.borderStyle = '';
    selectPhotoBtn.style.color = "#212121";
    selectPhotoBtn.style.display = 'block';
    createFrame();

    //Add the camera and img element to DOM
    var pageContentElement = document.querySelector('.app__layout-content');
    pageContentElement.appendChild(camera);
    pageContentElement.appendChild(frame);

    //Click of camera fab icon
    // selectPhotoBtn.addEventListener('click', () => {
    //   scanningEle.style.display = 'none';
    //   document.querySelector("#camera").click();
    // });
    
    //On camera change
    // camera.addEventListener('change', (event) => {
    //   if (event.target && event.target.files.length > 0) {
    //     frame.className = 'app__overlay';
    //     frame.src = URL.createObjectURL(event.target.files[0]);
    //     scanningEle.style.display = 'block';
    //     window.appOverlay.style.borderColor = '#212121';
    //     scan();
    //   }
    // });
  }
});
