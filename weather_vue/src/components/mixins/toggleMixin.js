export default {
    props: {
        show: Boolean,
    },
    methods: {
        hideDialog() {
            this.$emit('update:show', false);
        },
    },
}
