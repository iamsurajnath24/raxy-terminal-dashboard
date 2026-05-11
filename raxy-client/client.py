import asyncio
import websockets
import subprocess

async def connect_to_server():
    uri = "wss://raxy-terminal-dashboard.onrender.com"

    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket Server")

        await websocket.send("ROLE:RAXY")

        while True:
            command = input("CMD> ")

            if command.lower() == "exit":
                break

            try:
                result = subprocess.check_output(
                    command,
                    shell=True,
                    stderr=subprocess.STDOUT,
                    text=True
                )

                await websocket.send(f"$ {command}\n\n{result}")

            except subprocess.CalledProcessError as e:
                await websocket.send(f"$ {command}\n\n{e.output}")

asyncio.run(connect_to_server())