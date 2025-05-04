import { detect } from "detect-browser";
import { createBrowser } from "../services/userService";
import { getUserData } from "../services/AuthService";
import { useEffect } from "react";


const BrowserTrack = () => {
  const browser = detect();
  const users = getUserData();

  useEffect(() => {
    // Check if we've already recorded this browser info
    const storageKey = "browserTracked";
    const alreadyTracked = sessionStorage.getItem(storageKey);

    if (browser && users?.id && !alreadyTracked) {
      createBrowser({
        user_id: users?.id,
        browser_name: browser?.name,
        browser_version: browser?.version,
        os: browser?.os,
      })
        .then((res) => {
          console.log("View recorded successfully:", res);
          // Set a flag in localStorage to indicate we've tracked this browser
          sessionStorage.setItem(storageKey, "true");
        })
        .catch((err) => {
          console.error("Failed to record view:", err);
        });
    } else if (alreadyTracked) {
      console.log("Browser already tracked for this user");
    } else {
      console.log("Could not detect browser.");
    }
  }, [browser, users?.id]);
  return (
    <div>
      
    </div>
  )
}

export default BrowserTrack;
