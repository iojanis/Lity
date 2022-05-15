<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="state.isEditOpen">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="toggleOnly('edit')"
    >
      <div
        class="
          flex
          items-end
          justify-center
          min-h-screen
          pt-4
          px-4
          pb-20
          text-center
          dark:bg-gray-900
          bg-white bg-opacity-50
          dark:bg-opacity-50
          sm:block sm:p-0
        "
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-20"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-20"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 transition-opacity"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-20"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-20"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="
              inline-block
              align-top
              bg-white dark:bg-lityblack
              rounded-lg
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              sm:my-8  sm:max-w-lg sm:w-full
            "
          >
            <div class="bg-white dark:bg-lityblack px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
<!--                <div-->
<!--                  class="-->
<!--                    mx-auto-->
<!--                    flex-shrink-0 flex-->
<!--                    items-center-->
<!--                    justify-center-->
<!--                    h-12-->
<!--                    w-12-->
<!--                    rounded-full-->
<!--                    bg-red-100-->
<!--                    sm:mx-0 sm:h-10 sm:w-10-->
<!--                  "-->
<!--                >-->
<!--                  icon-->
<!--                </div>-->
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    v-if="false"
                    as="h3"
                    class="text-lg leading-6 font-sans font-bold text-gray-900 dark:text-gray-100"
                  >
                    Do you want to delete all Nodes?
                  </DialogTitle>
                  <div class="mt-2">

                    <div class="mt-2">
                      <label
                        for="company-website"
                        class="
                          block
                          text-sm
                          font-medium
                          text-gray-700
                          dark:text-gray-200
                        "
                      >Space Name</label
                      >
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                          v-model="spaceName"
                          type="text"
                          autofocus
                          tabindex="0"
                          name="lity-server"
                          class="
                      h-8
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-blue-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          "
                          placeholder="Name"
                        />
                      </div>
                    </div>

                    <div class="mt-2">
                      <label
                        for="company-website"
                        class="
                          block
                          text-sm
                          font-medium
                          text-gray-700
                          dark:text-gray-200
                        "
                      >Space ID</label
                      >
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                          v-model="spaceId"
                          type="text"
                          autofocus
                          tabindex="0"
                          name="lity-server"
                          class="
                      h-8
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-blue-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          "
                          placeholder="Name"
                        />
                      </div>
                    </div>

                    <div class="mt-2">
                      <label
                        for="company-website"
                        class="
                          block
                          text-sm
                          font-medium
                          text-gray-700
                          dark:text-gray-200
                        "
                      >Server Address</label
                      >
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                          v-model="serverAddress"
                          type="text"
                          autofocus
                          tabindex="0"
                          name="lity-server"
                          class="
                      h-8
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-blue-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          "
                          placeholder="Name"
                        />
                      </div>
                    </div>



                    <div class="mt-2">
                      <label
                        for="company-website"
                        class="
                          block
                          text-sm
                          font-medium
                          text-gray-700
                          dark:text-gray-200
                        "
                      >Server Token</label
                      >
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                          v-model="serverToken"
                          type="text"
                          autofocus
                          tabindex="0"
                          name="lity-server"
                          class="
                      h-8
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-blue-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          "
                          placeholder="Name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-opacity-50 dark:bg-opacity-50 dark:bg-gray-900 bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button
                type="button"
                class="
                  w-full
                  inline-flex
                  justify-center
                  rounded-md
                  border border-transparent
                  shadow-sm
                  px-4
                  py-2
                  bg-red-600
                  text-base
                  font-medium
                  text-white
                  hover:bg-red-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-red-500
                  sm:ml-3 sm:w-auto sm:text-sm
                "
                @click="
                  open = false;
                  emit('action');
                "
              >
                Delete
              </button>
              <button
                type="button"
                class="
                  mt-3
                  w-full
                  inline-flex
                  justify-center
                  rounded-md
                  border border-gray-300
                  shadow-sm
                  px-4
                  py-2
                  bg-white dark:bg-black
                  text-base
                  font-medium
                  text-gray-700
                  dark:text-gray-100
                  dark:hover:ring-2
                  hover:bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-indigo-500
                  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                "
                @click="
                  open = false;
                  emit('cancel');
                "
                ref="cancelButtonRef"
              >
                Cancel
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useSettings } from "../composables/useSettings";
import { useSpaces } from "../composables/useSpaces";

const { state, toggleOnly } =
  useSettings();
const { localSpaces, resetSpaces, getSpace } = useSpaces();

// const props = defineProps<{
//   open: boolean;
//   name: string;
//   id: string;
//   server: string;
//   token: string;
// }>();

const emit = defineEmits(["action"]);
</script>
