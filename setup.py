import os
import sys
import json
import urllib.request
import subprocess

API_KEY = "NNzrvdu5hB0aFmhwOwyl7EecQsVyY3ty"
API_URL = "https://api.mistral.ai/v1/chat/completions"

def call_mistral(prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    data = {
        "model": "mistral-small-latest",
        "messages": [
            {
                "role": "system",
                "content": "You are the DarkCity (DC) Game Engine Assistant. Your job is to help the user write C++ code using GCC to build games. Respond with valid C++ code and explanations. Keep it concise. If providing code, wrap it in ```cpp and ```."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    req = urllib.request.Request(API_URL, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except Exception as e:
        return f"Error calling Mistral API: {e}"

def extract_code(response_text):
    if "```cpp" in response_text:
        parts = response_text.split("```cpp")
        if len(parts) > 1:
            code_part = parts[1].split("```")[0]
            return code_part.strip()
    return None

def main():
    print("==================================================")
    print("      Welcome to DarkCity (DC) Game Engine        ")
    print("==================================================")
    print("Initializing environment...")
    
    project_name = "darkcity_project"
    if not os.path.exists(project_name):
        print(f"Cloning DarkCity (Godot-based) graphical engine into {project_name}...")
        subprocess.run(["git", "clone", "https://github.com/vonog99-max/godot.git", project_name])
        print(f"Created project directory: {project_name}")
    
    os.chdir(project_name)
    
    print("\nDarkCity CLI is ready. Type your prompt to generate game code, or type a command.")
    print("Commands:")
    print("  /dashboard  - Open the DarkCity dashboard (web)")
    print("  /build      - Compile the engine using SCons (Godot build system)")
    print("  /run        - Run the compiled engine")
    print("  /exit       - Exit the CLI")
    
    while True:
        try:
            user_input = input("\nDC> ").strip()
        except (KeyboardInterrupt, EOFError):
            break
            
        if not user_input:
            continue
            
        if user_input.lower() == "/exit":
            print("Exiting DarkCity...")
            break
        elif user_input.lower() == "/dashboard":
            print("Opening DarkCity Dashboard...")
            dashboard_url = "https://darkcityv1.vercel.app/dashboard"
            print(f"Please visit: {dashboard_url}")
            try:
                import webbrowser
                webbrowser.open(dashboard_url)
            except:
                pass
        elif user_input.lower() == "/build":
            print("Compiling DarkCity Engine (Godot)...")
            print("Note: This requires SCons and a C++ compiler installed.")
            result = subprocess.run(["scons", "platform=windows"], capture_output=False)
            if result.returncode == 0:
                print("Build successful!")
            else:
                print("Build failed. Make sure you have SCons installed.")
        elif user_input.lower() == "/run":
            print("Running DarkCity Engine...")
            # Attempt to find the compiled binary in bin/
            bin_dir = "bin"
            if os.path.exists(bin_dir):
                binaries = [f for f in os.listdir(bin_dir) if "godot" in f or "darkcity" in f]
                if binaries:
                    subprocess.run([os.path.join(bin_dir, binaries[0])])
                else:
                    print("No executable found in bin/. Run /build first.")
            else:
                print("bin/ directory not found. Run /build first.")
        else:
            print("Thinking...")
            response = call_mistral(user_input)
            print("\n--- Mistral Response ---")
            print(response)
            print("------------------------")
            
            code = extract_code(response)
            if code:
                save = input("\nDo you want to save this code to a new module? (y/n): ").strip().lower()
                if save == 'y':
                    filename = input("Enter filename (e.g., modules/my_module/my_code.cpp): ").strip()
                    if filename:
                        os.makedirs(os.path.dirname(filename), exist_ok=True)
                        with open(filename, "w") as f:
                            f.write(code)
                        print(f"Saved to {filename}")

if __name__ == "__main__":
    main()
