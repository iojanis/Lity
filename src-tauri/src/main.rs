#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
  fn custom_menu(name: &str) -> CustomMenuItem {
    let c = CustomMenuItem::new(name.to_string(), name);
    return c;
  }
  let menu = Menu::new()
    .add_submenu(Submenu::new(
      "Lity",
      Menu::new()
        .add_native_item(MenuItem::About("Lity".to_string()))
        .add_item(custom_menu("Open Settings").accelerator("cmdOrControl+p"))
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Quit),
    ))
    .add_submenu(Submenu::new(
      "Gravity",
      Menu::new()
        .add_item(custom_menu("Show Documents").accelerator("cmdOrControl+up"))
        .add_item(custom_menu("New Document").accelerator("cmdOrControl+n"))
        .add_native_item(MenuItem::Separator)
        .add_item(custom_menu("Zoom In").accelerator("cmdOrControl+plus"))
        .add_item(custom_menu("Zoom Out").accelerator("cmdOrControl+-"))
        .add_item(custom_menu("Center-Gravity").accelerator("cmdOrControl+dot"))
        .add_item(custom_menu("No-Gravity").accelerator("cmdOrControl+Comma"))
        .add_item(custom_menu("Unfix-Gravity").accelerator("cmdOrControl+o,"))
        .add_native_item(MenuItem::Separator)
        .add_item(custom_menu("Undo ").accelerator("cmdOrControl+y"))
        .add_item(custom_menu("Redo").accelerator("cmdOrControl+z"))
    ))
    .add_submenu(Submenu::new(
      "Node",
      Menu::new()
        .add_item(custom_menu("Open Search").accelerator("cmdOrControl+f"))
        .add_native_item(MenuItem::Separator)
        .add_item(custom_menu("Previous Node").accelerator("shift+left"))
        .add_item(custom_menu("Next Node").accelerator("shift+right"))
        .add_item(custom_menu("Exit Node").accelerator("escape"))
        .add_native_item(MenuItem::Separator)
        .add_item(custom_menu("Delete Node").accelerator("cmdOrControl+backspace"))
        .add_item(custom_menu("Cut Node-Links").accelerator("cmdOrControl+shift+backspace"))
        .add_native_item(MenuItem::Separator)
        .add_item(custom_menu("New Root-Node").accelerator("cmdOrControl+j"))
        .add_item(custom_menu("New Child-Node").accelerator("cmdOrControl+k"))
        .add_item(custom_menu("Link Nodes").accelerator("cmdOrControl+l"))
    ))
    .add_submenu(Submenu::new(
      "Edit",
      Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste)
        .add_native_item(MenuItem::SelectAll)
    ))
    .add_submenu(Submenu::new(
      "Window",
      Menu::new()
        .add_item(custom_menu("Toggle Editor Breaks").accelerator("cmdOrControl+tab"))
        .add_item(custom_menu("Toggle Light/Dark").accelerator("cmdOrControl+x"))
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::EnterFullScreen)
        .add_native_item(MenuItem::Zoom),
    ));

  tauri::Builder::default()
    .menu(menu)
    .on_menu_event(|event| {
      let event_name = event.menu_item_id();
      event.window().emit("menu", event_name).unwrap();
      match event_name {
        "Learn More" => {
          println!("Learning more...");
        }
        _ => {}
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
