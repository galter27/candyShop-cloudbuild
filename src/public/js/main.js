// Side menu
const hamburgerMenu = document.getElementById('sideMenu-sign');
const dropdownContent = document.getElementById('sideMenu-content');
const sideMenuVideos = document.getElementById('sideMenu-videos');
const videos = document.querySelectorAll('.sideMenu-video');
const closeButton = document.getElementById('close-button');
const pageContent = document.getElementById('page-content');
let currentVideoIndex = 0;

// // Function to play videos
// function playNextVideo() {
//     // Hide all videos first
//     videos.forEach(video => {
//         video.style.display = 'none';
//         video.pause();
//     });

//     // Show and play current video
//     if (currentVideoIndex < videos.length) {
//         const currentVideo = videos[currentVideoIndex];
//         currentVideo.style.display = 'block';
        
//         // Try to play the video
//         const playPromise = currentVideo.play();
//         if (playPromise !== undefined) {
//             playPromise.catch(error => {
//                 console.log("Video play error:", error);
//             });
//         }

//         // Set up the ended event for the current video
//         currentVideo.onended = () => {
//             currentVideo.style.display = 'none';
//             currentVideoIndex = (currentVideoIndex + 1) % videos.length;
//             playNextVideo();
//         };
//     }
// }

// // Initialize the video display
// function initializeVideos() {
//     sideMenuVideos.style.display = 'flex'; // Show the video section
//     playNextVideo(); // Start playing the videos
// }

// // Close button event
// closeButton.addEventListener('click', () => {
//     sideMenuVideos.style.display = 'none';
//     videos.forEach(video => {
//         video.pause();
//         video.style.display = 'none';
//     });
//     if (pageContent) {
//         pageContent.classList.add('full-width');
//     }
// });
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        // Toggle the active class on the hamburger menu
        hamburgerMenu.classList.toggle('active');
        
        // Toggle the visibility of the dropdown content
        dropdownContent.classList.toggle('active');

        if (dropdownContent.classList.contains('active')) {
            sideMenuVideos.style.display = 'none'; // Hide videos when menu is active
        } else {
            sideMenuVideos.style.display = 'flex'; // Show videos when menu is inactive
            playNextVideo();
        }
    });
}

// Initialize everything when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     initializeVideos();
// });


document.addEventListener('DOMContentLoaded', () => {
    const sideMenuVideos = document.getElementById('sideMenu-videos');
    const closeButton = document.getElementById('close-button');
    const videos = Array.from(document.querySelectorAll('.sideMenu-video'));
    let currentVideoIndex = 0;

    // Function to check if 10 minutes have passed since last close
    function shouldShowPanelAgain() {
        const lastClosedTime = localStorage.getItem('videoPanelLastClosed');
        if (!lastClosedTime) return true; // If no close time exists, show the panel

        const tenMinutesInMs = 3 * 60 * 1000;
        const timeSinceLastClose = Date.now() - parseInt(lastClosedTime, 10);
        
        return timeSinceLastClose >= tenMinutesInMs;
    }

    // Function to play videos in sequence
    function playNextVideo() {
        // Hide and pause all videos first
        videos.forEach(video => {
            video.style.display = 'none';
            video.pause();
        });

        // Show and play current video if there are more videos
        if (currentVideoIndex < videos.length) {
            const currentVideo = videos[currentVideoIndex];
            currentVideo.style.display = 'block';
            
            // Try to play the video
            const playPromise = currentVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Video play error:", error);
                });
            }

            // Set up the ended event for the current video
            currentVideo.onended = () => {
                currentVideo.style.display = 'none';
                currentVideoIndex = (currentVideoIndex + 1) % videos.length;
                playNextVideo(); // Play the next video
            };
        }
    }

    // Initialize and start playing videos if 10 minutes have passed
    function initializeVideos() {
        sideMenuVideos.style.display = 'flex'; // Show the video section
        currentVideoIndex = 0; // Reset to the first video
        playNextVideo(); // Start playing videos in sequence
    }

    // Check if we should show the panel again based on the 10-minute rule
    if (shouldShowPanelAgain()) {
        initializeVideos();
    }

    // Close button functionality
    closeButton.addEventListener('click', () => {
        sideMenuVideos.style.display = 'none';
        videos.forEach(video => {
            video.pause();
            video.style.display = 'none';
        });
        localStorage.setItem('videoPanelLastClosed', Date.now()); // Save close time
    });
});
// Footer -About Us and Talk to Us
// Footer - About Us, Talk to Us, and Statistics Modals
document.addEventListener('DOMContentLoaded', () => {
    const aboutModal = document.getElementById("aboutModal");
    const talkModal = document.getElementById("talkModal");
    const statisticsModel = document.getElementById("statisticsModel");

    const openAboutModal = document.getElementById("openAboutModal");
    const openTalkModal = document.getElementById("openTalkModal");
    const openStatisticsModel = document.getElementById("openstatisticsModel");

    const closeButtons = document.querySelectorAll(".close-button");

    // Open About Us modal
    if (openAboutModal) {
        openAboutModal.addEventListener('click', (event) => {
            event.preventDefault();
            aboutModal.style.display = "block";
        });
    }

    // Open Talk to Us modal
    if (openTalkModal) {
        openTalkModal.addEventListener('click', (event) => {
            event.preventDefault();
            talkModal.style.display = "block";
        });
    }

    // Open Statistics modal
    if (openStatisticsModel) {
        openStatisticsModel.addEventListener('click', (event) => {
            event.preventDefault();
            statisticsModel.style.display = "block";
        });
    }

    // Close modals when clicking on close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal'); // Find the closest modal container
            if (modal) {
                modal.style.display = "none"; // Hide the modal
            }
        });
    });

    // Close modals when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === aboutModal) {
            aboutModal.style.display = "none";
        } else if (event.target === talkModal) {
            talkModal.style.display = "none";
        } else if (event.target === statisticsModel) {
            statisticsModel.style.display = "none";
        }
    });
});

(function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://bringthemhomenow.net/1.1.0/hostages-ticker.js";
    script.setAttribute(
      "integrity",
      "sha384-DHuakkmS4DXvIW79Ttuqjvl95NepBRwfVGx6bmqBJVVwqsosq8hROrydHItKdsne"
    );
    script.setAttribute("crossorigin", "anonymous");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();