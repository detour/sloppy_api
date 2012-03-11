require 'test_helper'

class SearchLogsControllerTest < ActionController::TestCase
  setup do
    @search_log = search_logs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:search_logs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create search_log" do
    assert_difference('SearchLog.count') do
      post :create, :search_log => @search_log.attributes
    end

    assert_redirected_to search_log_path(assigns(:search_log))
  end

  test "should show search_log" do
    get :show, :id => @search_log.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @search_log.to_param
    assert_response :success
  end

  test "should update search_log" do
    put :update, :id => @search_log.to_param, :search_log => @search_log.attributes
    assert_redirected_to search_log_path(assigns(:search_log))
  end

  test "should destroy search_log" do
    assert_difference('SearchLog.count', -1) do
      delete :destroy, :id => @search_log.to_param
    end

    assert_redirected_to search_logs_path
  end
end
