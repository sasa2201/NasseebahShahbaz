const scrollContainer = document.getElementById('scrollContainer');
const envelopeContainer = document.getElementById('envelopeContainer');

// Monitor scrolling to dynamically open or close the envelope
scrollContainer.addEventListener('scroll', () => {
    if (scrollContainer.scrollTop > 40) {
        envelopeContainer.classList.add('open');
    } else {
        envelopeContainer.classList.remove('open');
    }
});
