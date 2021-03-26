'use strict'

//document.addEventListener("DOMContentLoaded", getNotesList)

async function getNotesList() {
  const eventSource = new EventSource('/notes')

  eventSource.onmessage = event => {
    console.log(event.data)
  }

}
