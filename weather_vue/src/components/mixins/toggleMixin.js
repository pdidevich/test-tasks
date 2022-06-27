export default {
    props: {
        show: Boolean,
        default: false,
    },
    methods: {
        hideDialog() {
            this.$emit('update:show', false);
        },
    },
}
