import React, { useState } from 'react';
import { useFetch } from "../../../hooks/useFetch.js";
import { Table } from '@mantine/core';
import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import api from '../../../utils/axios';
import '@mantine/notifications/styles.css';

const TableReservationsList = (e) => {
    const [deletingId, setDeletingId] = useState(null);
    const { data: reservations, loading: isLoadingReserv, error: errorReserv, refetch: refetchReserv } = useFetch('/tables/reservations');

    const openDeleteModal = (e, _id) => {
        e.stopPropagation();
        modals.openConfirmModal({
            title: 'Please confirm your action',
            size: 'sm',
            radius: 'md',
            withCloseButton: false,
            children: (
                <Text size="sm">
                    Do you really want to delete this element?.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => deleteReservation(_id),
        });
    }

    const openErrorNotification = () => {
        notifications.show({
            title: 'Error',
            message: 'Cannot delete element!',
            color: 'red',
            autoClose: 4000,
            withCloseButton: true,
        })
    }

    const openSuccessNotification = () => {
        notifications.show({
            title: 'Success',
            message: 'Element deleted!',
            color: 'green',
        })
    }


    const deleteReservation = async (_id) => {

        try {
            setDeletingId(_id);
            const response = await api.delete(`/tables/reservations/${_id}`);
            openSuccessNotification()
        } catch (err) {
            console.log(err);
            openErrorNotification()
        } finally {
            setDeletingId(null);
            refetchReserv()
        }


    }


    const rows = reservations?.map((element) => (
        <Table.Tr key={element._id} onClick={() => alert(element.customerDetails.name)}>
            <Table.Td >{element.tableNumber}</Table.Td>
            <Table.Td >{element.timeSlot.start}</Table.Td>
            <Table.Td >{element.customerDetails.name}</Table.Td>
            <Table.Td><Button onClick={(e) => openDeleteModal(e, element._id)} disabled={deletingId === element._id}>
                {deletingId === element._id ? 'Deleting...' : 'Delete'}
            </Button>
            </Table.Td>

        </Table.Tr>
    ));
    return (
        <>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Table No.</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Options</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>

            </Table>

        </>
    )
};

export default TableReservationsList;