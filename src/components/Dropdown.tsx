import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes:string[]) {
    return classes.filter(Boolean).join(' ')
}

type DropdownProps = {
    title: string,
    values: string[],
    onItemSelect: (value: string)=> void
}
export default function Dropdown({title, values, onItemSelect}:DropdownProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
        <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-sm bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {title}
            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </Menu.Button>
        </div>

        <Transition
        as={(values.length > 1) ? Fragment : undefined}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
    >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
            {
                values.map((value, index)=>{
                    return (<Menu.Item key={index}>
                        {({ active }) => (
                            <button
                                onClick={()=>{onItemSelect(value)}}
                                className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full  text-start'
                                )}
                            >
                                {value}
                            </button>
                            )}
                        </Menu.Item>)
                })
            }
            </div>
            </Menu.Items>
        </Transition>
        </Menu>
    )
}
