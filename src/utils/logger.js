export function logToServer(data) {
  try {
    navigator.sendBeacon(
      "/api/log",
      JSON.stringify({
        ...data,
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
    );
  } catch (error) {
    console.error("Error sending log:", error);
  }
}