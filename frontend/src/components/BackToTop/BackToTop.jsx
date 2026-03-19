import React from 'react'
import "./BackToTop.css"

const BackToTop = () => {
    let calcScrollValue = () => {
        let scrollProgress = document.getElementById("progress");
        let progressValue = document.getElementById("progress-value");

        if (!scrollProgress || !progressValue) {
            return;
        }

        let pos = document.documentElement.scrollTop;

        let calcHeight = document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        let scrollValue = Math.round((pos * 100) / calcHeight)

        if (pos > 100) {
            scrollProgress.style.display = "grid"
        } else {
            scrollProgress.style.display = "none"
        }
        scrollProgress.addEventListener("click", (e) => {
            document.documentElement.scrollTop = 0;
        });
        scrollProgress.style.background = `
        conic-gradient(#03cc65 ${scrollValue}%,#d7d7d7 ${scrollValue}%)`;

    }
    window.addEventListener('scroll', calcScrollValue);
    window.addEventListener('load', calcScrollValue);

    return (
        <>
            <div id="progress">
                <span id="progress-value">
                    &#x1F815;
                </span>
            </div>
        </>
    )
}

export default BackToTop

