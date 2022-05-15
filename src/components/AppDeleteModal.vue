<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      class="fixed inset-0 z-10 overflow-y-auto"
      @close="open = false"
    >
      <div
        class="flex min-h-screen select-none items-end justify-center bg-white bg-opacity-50 px-4 pt-4 pb-20 text-center dark:bg-zinc-900 dark:bg-opacity-50 sm:block sm:p-0"
      >
        <TransitionChild as="template">
          <DialogOverlay class="fixed inset-0 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild as="template">
          <div
            class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-black/50 backdrop-blur text-left align-bottom shadow-xl transition-all dark:bg-lityblack sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          >
            <div
              class="bg-white px-4 pt-5 pb-4 dark:bg-black/50 backdrop-blur sm:p-6 sm:pb-4"
            >
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
                    as="h3"
                    class="font-sans text-lg font-bold leading-6 text-zinc-900 dark:text-zinc-100"
                  >
                    Do you want to delete all Nodes?
                  </DialogTitle>
                  <div class="mt-2">
                    <p
                      class="text-sm font-medium text-zinc-500 dark:text-zinc-300"
                    >
                      This action can only be partially reversed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-zinc-100 bg-opacity-50 px-4 py-3 dark:bg-zinc-900 dark:bg-opacity-50 sm:flex sm:flex-row-reverse sm:px-6"
            >
              <button
                type="button"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                @click="
                  open = false;
                  emit('action');
                "
              >
                Delete
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-base font-medium text-zinc-700 shadow-sm hover:bg-gray-200/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-black dark:text-zinc-100 dark:hover:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(["action"]);
</script>
