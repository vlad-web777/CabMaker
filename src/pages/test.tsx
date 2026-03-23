export default function Test() {
  const testCreateCabinet = async () => {
    try {
      const response = await fetch(
        "https://xlf7u20eu2.execute-api.us-east-1.amazonaws.com/default/createCabinet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cabinetType: "frameless",
            cabinetKey: "test-1",
            name: "Test Cabinet 1",
          }),
        }
      );

      const text = await response.text();
      console.log("status:", response.status);
      console.log("response:", text);
    } catch (error) {
      console.error("createCabinet test error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={testCreateCabinet}>
        Test Create Cabinet
      </button>
    </div>
  );
}