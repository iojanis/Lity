#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(any(windows, target_os = "macos"))]

use tauri::{command, window::WindowBuilder, AppHandle, WindowUrl};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use cocoa::appkit::{NSWindow, NSWindowStyleMask};
use cocoa::{appkit::NSWindowOrderingMode, base::id};
use objc::{msg_send, sel, sel_impl};
use tauri::{Runtime, Window};
use tauri::Manager;

pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, transparent: bool);
}

impl<R: Runtime> WindowExt for Window<R> {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, transparent: bool) {
        use cocoa::appkit::NSWindowTitleVisibility;

        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;

            let mut style_mask = id.styleMask();
            style_mask.set(
                NSWindowStyleMask::NSFullSizeContentViewWindowMask,
                transparent,
            );
            id.setStyleMask_(style_mask);

            id.setTitleVisibility_(if transparent {
                NSWindowTitleVisibility::NSWindowTitleHidden
            } else {
                NSWindowTitleVisibility::NSWindowTitleVisible
            });
            id.setTitlebarAppearsTransparent_(if transparent {
                cocoa::base::YES
            } else {
                cocoa::base::NO
            });
        }
    }
}

#[command]
fn create_child_window(id: String, app: AppHandle) {

    let main = app.get_window("main").unwrap();

    let child = WindowBuilder::new(&app, id, WindowUrl::default())
        .title("Child")
        .inner_size(400.0, 300.0);

    if let (Some(main), Some(child)) = (
        app.get_window(&"main".to_string()),
        app.get_window(&"child".to_string()),
    ) {
        if let (Ok(parent_ptr), Ok(child_ptr)) =
        (main.ns_window(), child.ns_window())
        {
            unsafe {
                let _: () = msg_send![parent_ptr as id, addChildWindow: child_ptr as id ordered: NSWindowOrderingMode::NSWindowBelow];
            }
        }

        // Show content
        child.show();
    }

    // let main = app.get_window("main").unwrap();
    //
    // let child = WindowBuilder::new(&app, id, WindowUrl::default())
    //     .title("Child")
    //     .inner_size(400.0, 300.0);
    //
    // #[cfg(target_os = "macos")]
    //     let child = child.parent_window(main.ns_window().unwrap());
    // #[cfg(windows)]
    //     let child = child.parent_window(main.hwnd().unwrap());
    //
    // child.build().unwrap();
}

// #[command]
// fn close_splashscreen(window: tauri::Window) {
//     // Close splashscreen
//     if let Some(splashscreen) = window.get_window("splashscreen") {
//         splashscreen.close().unwrap();
//     }
//     // Show main window
//     window.get_window("main").unwrap().show().unwrap();
// }

#[command]
fn new_window(id: String, app: AppHandle) {
    #[cfg(any(windows, target_os = "macos"))]
        let main = app.get_window("main").unwrap();

    let window = WindowBuilder::new(&app, id, WindowUrl::default())
        .title("New Window")
        .inner_size(400.0, 300.0);

    #[cfg(target_os = "macos")]
        let window = window.parent_window(main.ns_window().unwrap());
    #[cfg(windows)]
        let window = window.parent_window(main.hwnd().unwrap());

    window.build();
}

fn main() {
  fn custom_menu(name: &str) -> CustomMenuItem {
    let c = CustomMenuItem::new(name.to_string(), name);
    return c;
  }
  let menu = Menu::new()
    .add_submenu(Submenu::new(
      "Lity",
      Menu::new()
        // .add_native_item(MenuItem::About("Lity".to_string(), "About Lity".to_string()))
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
        // .add_item(custom_menu("Zoom In").accelerator("cmdOrControl+"))
        .add_item(custom_menu("Zoom Out").accelerator("cmdOrControl+-"))
        // .add_item(custom_menu("Center-Gravity").accelerator("cmdOrControl+dot"))
        .add_item(custom_menu("No-Gravity").accelerator("cmdOrControl+comma"))
        // .add_item(custom_menu("Unfix-Gravity").accelerator("cmdOrControl+o,"))
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
    .on_page_load(|window, _payload| {
        window.set_transparent_titlebar(true);
    })
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
    // .invoke_handler(tauri::generate_handler![close_splashscreen])
    .invoke_handler(tauri::generate_handler![create_child_window])
    .setup(|app| {
      // let win = app.get_window("main").unwrap();
      // win.set_transparent_titlebar(true);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
